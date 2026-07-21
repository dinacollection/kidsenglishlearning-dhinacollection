export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  type: 'word-match' | 'fill-blank' | 'spelling' | 'translate' | 'listen-type';
  emoji: string;
  prompt: string;
  answer: string;
  options?: string[];
  hint?: string;
  difficulty: Difficulty;
  /** Petunjuk dalam Bahasa Indonesia agar anak-anak mengerti artinya */
  indonesianHint: string;
  /** Teks yang akan dibacakan oleh TTS (bahasa Inggris) */
  speechText?: string;
}

export interface HighScore {
  name: string;
  score: number;
  difficulty: Difficulty;
  date: string;
}

export type GameState = 'start' | 'playing' | 'paused' | 'gameover' | 'levelSelect';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  emoji?: string;
}
