/**
 * Web Speech API Text-to-Speech Accessibility Utility
 * Supports English, Hindi, and Kannada voice playback in modern browsers.
 */

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakText(text: string, language: 'en' | 'hi' | 'kn' = 'en', onEnd?: () => void): void {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis not supported in this browser.');
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slightly slower, clear cadence for educational lessons and children
  utterance.pitch = 1.0;

  // Map language codes
  let targetLang = 'en-IN';
  if (language === 'hi') targetLang = 'hi-IN';
  else if (language === 'kn') targetLang = 'kn-IN';

  utterance.lang = targetLang;

  // Try to find matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang === targetLang || v.lang.startsWith(language));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

