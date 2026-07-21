// Text-to-Speech utility using Web Speech API
// Membacakan soal dalam bahasa Inggris agar anak-anak belajar pengucapan

const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Konversi ALL CAPS ke proper case agar TTS membaca bukan mengeja
 * "CAT" → "Cat"
 * "I AM STUDYING" → "I am studying"  
 * "ELEPHANT" → "Elephant"
 * "THE SMARTEST" → "The smartest"
 * "SHE GOES TO SCHOOL" → "She goes to school"
 */
function toReadableText(text: string): string {
  if (!text) return text;

  // Cek apakah teks semuanya uppercase (atau mostly uppercase)
  const upperCount = (text.match(/[A-Z]/g) || []).length;
  const letterCount = (text.match(/[A-Za-z]/g) || []).length;

  if (letterCount > 0 && upperCount / letterCount > 0.7) {
    // Konversi ke sentence case: huruf pertama besar, sisanya kecil
    return text
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase()) // Kapitalkan huruf pertama
      .replace(/\bi\b/g, 'I'); // "i" tunggal selalu kapital dalam bahasa Inggris
  }

  return text;
}

/**
 * Buat kalimat konteks agar TTS membaca secara natural, bukan mengeja
 * Untuk kata pendek (1-2 kata), bungkus dalam kalimat
 * Untuk kalimat panjang (3+ kata), langsung baca
 */
function makeAnswerSpeech(answer: string): string {
  const readable = toReadableText(answer);
  const wordCount = readable.trim().split(/\s+/).length;

  if (wordCount <= 2) {
    // Kata pendek — bungkus dalam kalimat agar tidak dieja
    // "Cat" → "The answer is: Cat."
    // "On" → "The answer is: On."
    return `The answer is: ${readable}.`;
  }

  // Kalimat panjang — baca langsung sebagai kalimat utuh
  // "She goes to school" → "She goes to school."
  return readable.endsWith('.') ? readable : `${readable}.`;
}

/**
 * Get the best English voice available
 */
function getEnglishVoice(): SpeechSynthesisVoice | null {
  if (!isSupported) return null;
  const voices = window.speechSynthesis.getVoices();

  // Prefer female English voices (friendlier for kids)
  const preferred = voices.find(v =>
    v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
  );
  if (preferred) return preferred;

  // Try Google English voice (natural sounding)
  const google = voices.find(v =>
    v.lang.startsWith('en') && v.name.toLowerCase().includes('google')
  );
  if (google) return google;

  // Try any en-US voice
  const enUS = voices.find(v => v.lang === 'en-US');
  if (enUS) return enUS;

  // Any English voice
  const english = voices.find(v => v.lang.startsWith('en'));
  if (english) return english;

  // Fallback to first available
  return voices[0] || null;
}

/**
 * Speak text aloud in English
 * Rate natural untuk membaca soal
 */
export function speakEnglish(text: string, onEnd?: () => void): void {
  if (!isSupported) return;

  // Cancel any ongoing speech
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getEnglishVoice();
  if (voice) {
    utterance.voice = voice;
  }
  utterance.lang = 'en-US';
  utterance.rate = 0.9;    // Sedikit lebih lambat dari normal, tapi tetap natural
  utterance.pitch = 1.05;  // Sedikit lebih tinggi (friendly untuk anak)
  utterance.volume = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Speak the answer like reading, NOT spelling
 * Mengucapkan jawaban secara natural seperti membaca, bukan mengeja huruf per huruf
 */
export function speakAnswer(answer: string, onEnd?: () => void): void {
  if (!isSupported) return;

  stopSpeaking();

  // Konversi jawaban ke format yang bisa dibaca TTS secara natural
  const speechText = makeAnswerSpeech(answer);

  const utterance = new SpeechSynthesisUtterance(speechText);
  const voice = getEnglishVoice();
  if (voice) {
    utterance.voice = voice;
  }
  utterance.lang = 'en-US';
  utterance.rate = 0.88;   // Sedikit lebih lambat — jelas tapi tetap natural seperti membaca
  utterance.pitch = 1.05;  // Sama dengan speakEnglish agar konsisten
  utterance.volume = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Speak the full correct sentence (for fill-in-the-blank questions)
 * Membacakan kalimat lengkap setelah jawaban ditemukan
 */
export function speakFullSentence(prompt: string, answer: string, onEnd?: () => void): void {
  if (!isSupported) return;

  stopSpeaking();

  // Ganti ___ atau blank dengan jawaban
  const fullSentence = prompt
    .replace(/___/g, toReadableText(answer))
    .replace(/blank/gi, toReadableText(answer));

  const readable = toReadableText(fullSentence);

  const utterance = new SpeechSynthesisUtterance(readable);
  const voice = getEnglishVoice();
  if (voice) {
    utterance.voice = voice;
  }
  utterance.lang = 'en-US';
  utterance.rate = 0.88;
  utterance.pitch = 1.05;
  utterance.volume = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (!isSupported) return;
  window.speechSynthesis.cancel();
}

/**
 * Check if TTS is currently speaking
 */
export function isSpeaking(): boolean {
  if (!isSupported) return false;
  return window.speechSynthesis.speaking;
}

/**
 * Check if TTS is supported in this browser
 */
export function isTTSSupported(): boolean {
  return isSupported;
}

/**
 * Preload voices (some browsers need this)
 */
export function preloadVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (!isSupported) {
      resolve();
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve();
      return;
    }
    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      resolve();
    };
    // Timeout fallback
    setTimeout(resolve, 2000);
  });
}
