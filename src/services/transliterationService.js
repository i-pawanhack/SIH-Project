export class TransliterationService {
  static debounceTimers = new Map();

  static async fetchHindi(text) {
    if (!text) return text;
    try {
      const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`);
      const data = await response.json();
      if (data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
        return data[1][0][1][0]; // First suggestion
      }
    } catch (e) {
      console.warn('Transliteration network error:', e);
    }
    return text;
  }

  static enableTransliteration(inputElement) {
    if (!inputElement) return;

    // Listen to the input event for real-time translation as they type
    inputElement.addEventListener('input', (e) => {
      // Only run if language is Hindi
      if (window.getLanguage && window.getLanguage() !== 'hi') return;

      // Ignore if user is deleting text (backspace) to avoid aggressively overwriting
      if (e.inputType === 'deleteContentBackward') return;

      const val = inputElement.value;
      const cursorPosition = inputElement.selectionStart;

      // Find the English word that the cursor is currently inside or at the end of
      const beforeCursor = val.substring(0, cursorPosition);
      const afterCursor = val.substring(cursorPosition);
      
      const matchBefore = beforeCursor.match(/([a-zA-Z]+)$/);
      const matchAfter = afterCursor.match(/^([a-zA-Z]*)/);
      
      if (matchBefore) {
        const engWord = matchBefore[1] + (matchAfter ? matchAfter[1] : '');
        const startIndex = beforeCursor.length - matchBefore[1].length;
        const endIndex = cursorPosition + (matchAfter ? matchAfter[1].length : 0);

        // Clear existing debounce timer for this element
        if (this.debounceTimers.has(inputElement)) {
          clearTimeout(this.debounceTimers.get(inputElement));
        }

        // Debounce the network request by 400ms to allow typing flow
        const timer = setTimeout(async () => {
          const hindiWord = await this.fetchHindi(engWord);
          
          if (hindiWord && hindiWord !== engWord) {
            // Re-fetch current value and cursor in case it changed during the await
            const currentVal = inputElement.value;
            const currentCursor = inputElement.selectionStart;
            
            // Only replace if the word at that location is still the same English word
            if (currentVal.substring(startIndex, endIndex) === engWord) {
              const newText = currentVal.substring(0, startIndex) + hindiWord + currentVal.substring(endIndex);
              inputElement.value = newText;
              
              // Adjust cursor position
              const newCursorPos = startIndex + hindiWord.length;
              inputElement.setSelectionRange(newCursorPos, newCursorPos);
              
              // Dispatch a lightweight input event so React/Frameworks (or custom listeners) catch the update
              inputElement.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        }, 400); // 400ms delay for real-time typing
        
        this.debounceTimers.set(inputElement, timer);
      }
    });
  }
}
