/**
 * RetinaXAI — Local Database, Telemetry Sync & Storage Service
 * Handles offline persistence, case indexing, and rural tele-sync queues.
 */

import { SAMPLE_CASES } from '../data/sampleCases.js';
import { ImageProcessor } from './imageProcessor.js';

const STORAGE_KEY = 'retinaxai_screenings_v1';
const SYNC_QUEUE_KEY = 'retinaxai_sync_queue_v1';
const SETTINGS_KEY = 'retinaxai_settings_v1';

export class StorageService {
  /**
   * Initializes the storage database with preset sample cases if empty.
   */
  static initialize() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Generate fundus and GradCAM images for sample cases
      const initializedCases = SAMPLE_CASES.map(c => {
        const rawImage = ImageProcessor.generateFundusImage(c.stage, c.isUngradable);
        return {
          ...c,
          createdAt: c.createdAt || new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
          rawImage: rawImage,
          enhancedImage: c.isUngradable ? rawImage : null
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initializedCases));
    }

    if (!localStorage.getItem(SETTINGS_KEY)) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        demoMode: true,
        lowBandwidthMode: false,
        activeCentre: 'PHC Rampur — Primary Health Centre (District Ballia)',
        isOnline: navigator.onLine !== undefined ? navigator.onLine : true
      }));
    }
  }

  /**
   * Retrieves all screening cases sorted by most recent date.
   */
  static getScreenings() {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse screenings storage:', e);
      return [];
    }
  }

  /**
   * Retrieves a single screening case by ID.
   */
  static getScreeningById(id) {
    const list = this.getScreenings();
    return list.find(item => item.id === id || item.patient?.id === id) || null;
  }

  /**
   * Saves or updates a screening case.
   */
  static saveScreening(screeningCase) {
    const list = this.getScreenings();
    const existingIndex = list.findIndex(item => item.id === screeningCase.id);

    if (existingIndex >= 0) {
      list[existingIndex] = screeningCase;
    } else {
      list.unshift(screeningCase);
      // Also add to rural sync queue if in offline/low-bandwidth mode
      this.addToSyncQueue(screeningCase.id);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return screeningCase;
  }

  /**
   * Updates an ophthalmologist's review on a specific screening case.
   */
  static updateDoctorReview(caseId, doctorReview) {
    const list = this.getScreenings();
    const target = list.find(item => item.id === caseId);
    if (target) {
      target.doctorReview = {
        ...target.doctorReview,
        ...doctorReview,
        status: 'Reviewed',
        reviewedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return target;
    }
    return null;
  }

  /**
   * Calculates real-time dashboard KPIs.
   */
  static getStats() {
    const list = this.getScreenings();
    const total = list.length;
    let referable = 0;
    let nonReferable = 0;
    let ungradable = 0;
    let pendingDoctor = 0;
    let reviewedDoctor = 0;

    list.forEach(c => {
      if (c.isUngradable || c.imageQuality?.overall === 'UNGRADABLE') {
        ungradable++;
      } else if (c.aiResult) {
        if (c.aiResult.referable) {
          referable++;
        } else {
          nonReferable++;
        }
      }

      if (c.doctorReview?.status === 'Reviewed') {
        reviewedDoctor++;
      } else {
        pendingDoctor++;
      }
    });

    return {
      total,
      referable,
      nonReferable,
      ungradable,
      pendingDoctor,
      reviewedDoctor
    };
  }

  /**
   * Sync Queue management for Rural Telemedicine.
   */
  static getSyncQueue() {
    try {
      const data = localStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addToSyncQueue(caseId) {
    const queue = this.getSyncQueue();
    if (!queue.includes(caseId)) {
      queue.push(caseId);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    }
  }

  static clearSyncQueue() {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]));
  }

  static getSettings() {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : { demoMode: true, lowBandwidthMode: false };
    } catch {
      return { demoMode: true, lowBandwidthMode: false };
    }
  }

  static updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }
}
