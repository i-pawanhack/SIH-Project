export class TransliterationService {
  static debounceTimers = new Map();

  static HIGH_PRECISION = {
    'ayush': 'आयुष', 'Ayush': 'आयुष', 'AYUSH': 'आयुष',
    'ayushi': 'आयुषी', 'Ayushi': 'आयुषी', 'AYUSHI': 'आयुषी',
    'aayush': 'आयुष', 'Aayush': 'आयुष',
    'piyush': 'पीयूष', 'Piyush': 'पीयूष',
    'puce': 'पुस', 'Puce': 'पुस', 'PUCE': 'पुस',
    'pawan': 'पवन', 'Pawan': 'पवन', 'PAWAN': 'पवन',
    'bhura': 'भूरा', 'Bhura': 'भूरा', 'BHURA': 'भूरा',
    'jay': 'जय', 'Jay': 'जय', 'JAY': 'जय',
    'phc': 'पीएचसी', 'PHC': 'पीएचसी',
    'phc-001': 'पीएचसी-001', 'PHC-001': 'पीएचसी-001',
    'phc-002': 'पीएचसी-002', 'PHC-002': 'पीएचसी-002',
    'phc-003': 'पीएचसी-003', 'PHC-003': 'पीएचसी-003',
    'phc-004': 'पीएचसी-004', 'PHC-004': 'पीएचसी-004',
    'phc-005': 'पीएचसी-005', 'PHC-005': 'पीएचसी-005',
    'rameshwar': 'रामेश्वर', 'Rameshwar': 'रामेश्वर',
    'sunita': 'सुनीता', 'Sunita': 'सुनीता',
    'tariq': 'तारिक', 'Tariq': 'तारिक',
    'mohammad': 'मोहम्मद', 'Mohammad': 'मोहम्मद',
    'kamla': 'कमला', 'Kamla': 'कमला',
    'harish': 'हरीश', 'Harish': 'हरीश',
    'patel': 'पटेल', 'Patel': 'पटेल',
    'anita': 'अनीता', 'Anita': 'अनीता',
    'verma': 'वर्मा', 'Verma': 'वर्मा',
    'rajesh': 'राजेश', 'Rajesh': 'राजेश',
    'kumar': 'कुमार', 'Kumar': 'कुमार',
    'sharma': 'शर्मा', 'Sharma': 'शर्मा',
    'devi': 'देवी', 'Devi': 'देवी',
    'singh': 'सिंह', 'Singh': 'सिंह',
    'gupta': 'गुप्ता', 'Gupta': 'गुप्ता',
    'yadav': 'यादव', 'Yadav': 'यादव',
    'rahul': 'राहुल', 'Rahul': 'राहुल',
    'pooja': 'पूजा', 'Pooja': 'पूजा',
    'priya': 'प्रिया', 'Priya': 'प्रिया',
    'amit': 'अमित', 'Amit': 'अमित',
    'rohit': 'रोहित', 'Rohit': 'रोहित',
    'vikas': 'विकास', 'Vikas': 'विकास',
    'sanjay': 'संजय', 'Sanjay': 'संजय',
    'vijay': 'विजय', 'Vijay': 'विजय',
    'ajay': 'अजय', 'Ajay': 'अजय',
    'neha': 'नेहा', 'Neha': 'नेहा',
    'geeta': 'गीता', 'Geeta': 'गीता',
    'suman': 'सुमन', 'Suman': 'सुमन',
    'deepak': 'दीपक', 'Deepak': 'दीपक',
    'sunil': 'सुनील', 'Sunil': 'सुनील',
    'anil': 'अनिल', 'Anil': 'अनिल',
    'mukesh': 'मुकेश', 'Mukesh': 'मुकेश',
    'dinesh': 'दिनेश', 'Dinesh': 'दिनेश',
    'suresh': 'सुरेश', 'Suresh': 'सुरेश',
    'ramesh': 'रमेश', 'Ramesh': 'रमेश',
    'mahesh': 'महेश', 'Mahesh': 'महेश',
    'naresh': 'नरेश', 'Naresh': 'नरेश',
    'ashok': 'अशोक', 'Ashok': 'अशोक',
    'manish': 'मनीष', 'Manish': 'मनीष',
    'satish': 'सतीश', 'Satish': 'सतीश',
    'rakesh': 'राकेश', 'Rakesh': 'राकेश',
    'lokesh': 'लोकेश', 'Lokesh': 'लोकेश',
    'santosh': 'संतोष', 'Santosh': 'संतोष',
    'subhash': 'सुभाष', 'Subhash': 'सुभाष'
  };

  static CORRECTIONS = {
    'आयुसह': 'आयुष',
    'आयूसह': 'आयुष',
    'पहस': 'पुस',
    'पावान': 'पवन',
    'पवान': 'पवन',
    'भुरा': 'भूरा',
    'जाय': 'जय',
    'पीएचसी001': 'पीएचसी-001',
    'पीएचसी002': 'पीएचसी-002'
  };

  static async fetchHindi(text) {
    if (!text) return text;
    const clean = text.trim();
    if (this.HIGH_PRECISION[clean]) {
      return this.HIGH_PRECISION[clean];
    }
    if (this.HIGH_PRECISION[clean.toLowerCase()]) {
      return this.HIGH_PRECISION[clean.toLowerCase()];
    }

    try {
      const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(clean)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`);
      const data = await response.json();
      if (data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
        let suggested = data[1][0][1][0];
        if (this.CORRECTIONS[suggested]) {
          suggested = this.CORRECTIONS[suggested];
        }
        return suggested;
      }
    } catch (e) {
      console.warn('Transliteration network error:', e);
    }

    if (window.tData) {
      return window.tData(clean);
    }
    return text;
  }

  static enableTransliteration(inputElement) {
    if (!inputElement) return;

    // Transliterate on Space or input completion
    inputElement.addEventListener('input', (e) => {
      if (window.getLanguage && window.getLanguage() !== 'hi') return;
      if (e.inputType === 'deleteContentBackward') return;

      const val = inputElement.value;
      const cursorPosition = inputElement.selectionStart;
      const beforeCursor = val.substring(0, cursorPosition);

      // Trigger transliteration when space is pressed or trailing space is present
      if (/\s$/.test(beforeCursor) || e.data === ' ') {
        const words = beforeCursor.trimEnd().split(/\s+/);
        const lastWord = words[words.length - 1];
        
        if (lastWord && /[a-zA-Z]/.test(lastWord)) {
          this.fetchHindi(lastWord).then((hindiWord) => {
            if (hindiWord && hindiWord !== lastWord) {
              const currentVal = inputElement.value;
              const idx = currentVal.lastIndexOf(lastWord);
              if (idx !== -1) {
                const newText = currentVal.substring(0, idx) + hindiWord + currentVal.substring(idx + lastWord.length);
                inputElement.value = newText;
                const newPos = idx + hindiWord.length + 1;
                inputElement.setSelectionRange(newPos, newPos);
                inputElement.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }
          });
        }
      }
    });

    // Transliterate remaining English words on blur
    inputElement.addEventListener('blur', async () => {
      if (window.getLanguage && window.getLanguage() !== 'hi') return;
      const val = inputElement.value;
      if (val && /[a-zA-Z]/.test(val)) {
        const tokens = val.split(/(\s+)/);
        const translatedTokens = await Promise.all(tokens.map(async (tok) => {
          if (/[a-zA-Z]/.test(tok)) {
            return await TransliterationService.fetchHindi(tok);
          }
          return tok;
        }));
        const finalVal = translatedTokens.join('');
        if (finalVal !== val) {
          inputElement.value = finalVal;
          inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
  }
}
