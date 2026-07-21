import { HighScore, Difficulty } from './types';

const STORAGE_KEY = 'dcdhinacollection_highscores';

export function getHighScores(): HighScore[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHighScore(name: string, score: number, difficulty: Difficulty): HighScore[] {
  const scores = getHighScores();
  const newScore: HighScore = {
    name: name || 'Player',
    score,
    difficulty,
    date: new Date().toLocaleDateString('id-ID'),
  };
  scores.push(newScore);
  scores.sort((a, b) => b.score - a.score);
  const trimmed = scores.slice(0, 20);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
  return trimmed;
}

export function isHighScore(score: number): boolean {
  const scores = getHighScores();
  if (scores.length < 20) return score > 0;
  return score > (scores[scores.length - 1]?.score ?? 0);
}
