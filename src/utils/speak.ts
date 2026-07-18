import { Language } from '../types';

let isSpeaking = false;

export function speak(text: string, lang: Language, rate: number = 0.9, pitch: number = 1.1) {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech is not supported in this browser.');
    return;
  }

  // Cancel any active speech to avoid queueing delays
  try {
    window.speechSynthesis.cancel();
  } catch (e) {
    console.warn('Error cancelling speech synthesis:', e);
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set the locale appropriately
  utterance.lang = lang === 'tr' ? 'tr-TR' : 'en-US';
  utterance.rate = rate; // Slightly slower than 1.0 is great for kids to understand clearly
  utterance.pitch = pitch; // Slightly higher pitch sounds more friendly and childish!

  // Retrieve available voices and try to match the language
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const matchingVoice = voices.find(voice => 
      lang === 'tr' 
        ? voice.lang.startsWith('tr') 
        : voice.lang.startsWith('en')
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
  }

  // Handle Chrome & other browsers voice load delay
  window.speechSynthesis.onvoiceschanged = () => {
    const updatedVoices = window.speechSynthesis.getVoices();
    const matchingVoice = updatedVoices.find(voice => 
      lang === 'tr' 
        ? voice.lang.startsWith('tr') 
        : voice.lang.startsWith('en')
    );
    if (matchingVoice && !utterance.voice) {
      utterance.voice = matchingVoice;
    }
  };

  utterance.onstart = () => {
    isSpeaking = true;
  };

  utterance.onend = () => {
    isSpeaking = false;
  };

  utterance.onerror = (event) => {
    // Treat SpeechSynthesis errors as warnings rather than console.errors
    // because standard behaviors like "interrupted" (clicking fast) or 
    // "not-allowed" (blocked before first user interaction) are expected browser behaviors.
    console.warn(`SpeechSynthesisUtterance error: ${event.error}`, event);
    isSpeaking = false;
  };

  window.speechSynthesis.speak(utterance);
}
