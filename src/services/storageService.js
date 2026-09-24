/**
 * Drish Kalyan — Local Database, Telemetry Sync & Storage Service
 * Handles offline persistence, case indexing, and rural tele-sync queues.
 */

import { SAMPLE_CASES } from '../data/sampleCases.js';
import { ImageProcessor } from './imageProcessor.js';

const STORAGE_KEY = 'drishkalyan_screenings_v1';
const SYNC_QUEUE_KEY = 'drishkalyan_sync_queue_v1';
const SETTINGS_KEY = 'drishkalyan_settings_v1';

const memoryStore = {};

function safeGet(key) {
  try {
    return localStorage.getItem(key) || memoryStore[key] || null;
  } catch (e) {
    return memoryStore[key] || null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[StorageService] Fallback to in-memory store for ${key}:`, e);
    memoryStore[key] = value;
  }
}

export class StorageService {
  /**
   * Initializes the storage database with preset sample cases if empty.
   */
  static initialize() {
    try {
      if (!safeGet(STORAGE_KEY)) {
        // Store lightweight sample cases without huge upfront base64 canvas strings
        const initializedCases = SAMPLE_CASES.map(c => ({
          ...c,
          createdAt: c.createdAt || new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
          rawImage: null,
          enhancedImage: null
        }));
        safeSet(STORAGE_KEY, JSON.stringify(initializedCases));
      }

      if (!safeGet(SETTINGS_KEY)) {
        safeSet(SETTINGS_KEY, JSON.stringify({
          demoMode: true,
          lowBandwidthMode: false,
          activeCentre: 'PHC Rampur — Primary Health Centre (District Ballia)',
          isOnline: navigator.onLine !== undefined ? navigator.onLine : true
        }));
      }

      // Ensure default account PHC-001 exists with the correct password
      const existingAccounts = safeGet('drishkalyan_accounts_v1');
      if (!existingAccounts) {
        const initialAccounts = [{ phcId: 'PHC-001', password: '12345678', createdAt: new Date().toISOString() }];
        safeSet('drishkalyan_accounts_v1', JSON.stringify(initialAccounts));
      } else {
        try {
          const accounts = JSON.parse(existingAccounts);
          const phc001 = accounts.find(a => a.phcId === 'PHC-001');
          if (phc001) {
            phc001.password = '12345678';
          } else {
            accounts.push({ phcId: 'PHC-001', password: '12345678', createdAt: new Date().toISOString() });
          }
          safeSet('drishkalyan_accounts_v1', JSON.stringify(accounts));
        } catch (e) {
          const initialAccounts = [{ phcId: 'PHC-001', password: '12345678', createdAt: new Date().toISOString() }];
          safeSet('drishkalyan_accounts_v1', JSON.stringify(initialAccounts));
        }
      }
    } catch (err) {
      console.error('[StorageService] Initialization error caught safely:', err);
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

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Storage quota exceeded! Evicting oldest records to free up space...");
      // Evict oldest 10 records and try again
      if (list.length > 10) {
        list.splice(list.length - 10, 10);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (err) {
          console.error("Still failed to save after eviction.", err);
        }
      }
    }
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
      safeSet(STORAGE_KEY, JSON.stringify(list));
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
      try {
        localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      } catch(e) {
        console.warn("Storage quota exceeded in sync queue");
      }
    }
  }

  static clearSyncQueue() {
    safeSet(SYNC_QUEUE_KEY, JSON.stringify([]));
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
    safeSet(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }

  static getAccounts() {
    try {
      const data = localStorage.getItem('drishkalyan_accounts_v1');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static createAccount(phcId, password) {
    const accounts = this.getAccounts();
    if (accounts.find(a => a.phcId === phcId)) {
      return { success: false, message: 'Account already exists' };
    }
    accounts.push({ phcId, password, createdAt: new Date().toISOString() });
    safeSet('drishkalyan_accounts_v1', JSON.stringify(accounts));
    return { success: true };
  }

  static verifyLogin(phcId, password) {
    const normPhcId = (phcId || '').replace(/पीएचसी/g, 'PHC').trim();
    const accounts = this.getAccounts();
    const account = accounts.find(a => (a.phcId === phcId || a.phcId === normPhcId) && a.password === password);
    if (account) {
      // Save timestamp
      let logins = this.getLogins();
      logins.push({ phcId: normPhcId, timestamp: new Date().toISOString() });
      if (logins.length > 20) {
        logins = logins.slice(-20);
      }
      safeSet('drishkalyan_logins_v1', JSON.stringify(logins));
      
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  }

  static getLogins() {
    try {
      const data = localStorage.getItem('drishkalyan_logins_v1');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getCurrentUser() {
    const logins = this.getLogins();
    if (logins.length > 0) {
      return logins[logins.length - 1].phcId;
    }
    return 'PHC-UNKNOWN';
  }

  static logout() {
    localStorage.removeItem('drishkalyan_logins_v1');
  }

  // --- Admin Authentication ---
  static verifyAdminLogin(email, password) {
    const ADMIN_EMAIL = 'synapse.official.2026@gmail.com';
    const ADMIN_PASSWORD = '987654321';
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      safeSet('drishkalyan_admin_session_v1', JSON.stringify({
        email,
        name: 'DRISH KALYAN Administrator',
        timestamp: new Date().toISOString()
      }));
      return { success: true };
    }
    return { success: false, message: 'Invalid admin credentials' };
  }

  static isAdminLoggedIn() {
    return !!localStorage.getItem('drishkalyan_admin_session_v1');
  }

  static logoutAdmin() {
    localStorage.removeItem('drishkalyan_admin_session_v1');
  }
}
