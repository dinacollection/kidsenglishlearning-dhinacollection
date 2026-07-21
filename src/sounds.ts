// Web Audio API sound effects - no external files needed
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function ensureAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  if (!audioCtx) return;
  ensureAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playCorrect() {
  playTone(523.25, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(659.25, 0.1, 'sine', 0.15), 80);
  setTimeout(() => playTone(783.99, 0.15, 'sine', 0.15), 160);
  setTimeout(() => playTone(1046.50, 0.2, 'sine', 0.12), 250);
}

export function playWrong() {
  playTone(300, 0.15, 'sawtooth', 0.08);
  setTimeout(() => playTone(250, 0.2, 'sawtooth', 0.08), 100);
}

export function playClick() {
  playTone(800, 0.05, 'sine', 0.08);
}

export function playTick() {
  playTone(1000, 0.03, 'sine', 0.05);
}

export function playGameOver() {
  playTone(400, 0.2, 'sine', 0.12);
  setTimeout(() => playTone(350, 0.2, 'sine', 0.12), 200);
  setTimeout(() => playTone(300, 0.2, 'sine', 0.12), 400);
  setTimeout(() => playTone(200, 0.5, 'sawtooth', 0.06), 600);
}

export function playStreak() {
  const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.50];
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note, 0.1, 'sine', 0.1), i * 60);
  });
}

export function playStart() {
  playTone(440, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(554.37, 0.1, 'sine', 0.1), 100);
  setTimeout(() => playTone(659.25, 0.15, 'sine', 0.1), 200);
}

export function playCountdown() {
  playTone(600, 0.08, 'sine', 0.1);
}

export function playLevelUp() {
  const notes = [440, 554, 659, 880];
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note, 0.15, 'sine', 0.12), i * 100);
  });
}
