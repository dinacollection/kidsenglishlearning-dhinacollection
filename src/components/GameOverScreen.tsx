import React, { useState, useEffect } from 'react';
import { Difficulty, HighScore } from '../types';
import { getDifficultyConfig } from '../gameData';
import { saveHighScore, isHighScore, getHighScores } from '../highScores';

interface Props {
  score: number;
  correctAnswers: number;
  totalAnswered: number;
  streak: number;
  difficulty: Difficulty;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOverScreen: React.FC<Props> = ({
  score,
  correctAnswers,
  totalAnswered,
  streak,
  difficulty,
  onRestart,
  onMenu,
}) => {
  const config = getDifficultyConfig(difficulty);
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);
  const [scores, setScores] = useState<HighScore[]>([]);
  const [showScores, setShowScores] = useState(false);
  const isNew = isHighScore(score);
  const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  useEffect(() => {
    setScores(getHighScores());
  }, []);

  const handleSave = () => {
    const updated = saveHighScore(playerName || 'Anak Pintar', score, difficulty);
    setScores(updated);
    setSaved(true);
    setShowScores(true);
  };

  // Keyboard: Enter to restart, S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && saved) {
        onRestart();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saved, onRestart]);

  const getEmoji = () => {
    if (accuracy >= 90) return '🏆';
    if (accuracy >= 70) return '🌟';
    if (accuracy >= 50) return '👏';
    return '💪';
  };

  const getMessage = () => {
    if (accuracy >= 90) return 'Luar Biasa! Amazing!';
    if (accuracy >= 70) return 'Hebat! Great Job!';
    if (accuracy >= 50) return 'Bagus! Good Try!';
    return 'Terus Belajar! Keep Learning!';
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-y-auto py-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 mx-4 max-w-md w-full shadow-2xl text-center animate-pop max-h-[90vh] overflow-y-auto">
        {/* Brand banner */}
        <div className="mb-4">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl px-5 py-2 shadow-md shadow-yellow-500/20">
            <span className="text-yellow-900 font-extrabold text-sm sm:text-base font-fredoka tracking-wide">
              ✨ DCdhinacollection ✨
            </span>
          </div>
        </div>

        {/* Result emoji */}
        <div className="text-7xl mb-3 animate-bounce-slow">{getEmoji()}</div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 font-fredoka mb-1">
          {getMessage()}
        </h2>

        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${config.bgColor} ${config.textColor} font-nunito mb-4`}>
          {config.emoji} {config.label}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-indigo-50 rounded-2xl p-3">
            <div className="text-2xl font-extrabold text-indigo-600 font-fredoka">{score}</div>
            <div className="text-xs text-indigo-400 font-nunito font-semibold">Skor</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-3">
            <div className="text-2xl font-extrabold text-green-600 font-fredoka">{accuracy}%</div>
            <div className="text-xs text-green-400 font-nunito font-semibold">Akurasi</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-3">
            <div className="text-2xl font-extrabold text-yellow-600 font-fredoka">{correctAnswers}/{totalAnswered}</div>
            <div className="text-xs text-yellow-500 font-nunito font-semibold">Benar</div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-3">
            <div className="text-2xl font-extrabold text-orange-600 font-fredoka">🔥 {streak}</div>
            <div className="text-xs text-orange-400 font-nunito font-semibold">Max Streak</div>
          </div>
        </div>

        {/* High score save */}
        {!saved && score > 0 && (
          <div className="mb-6">
            {isNew && (
              <div className="text-yellow-500 font-bold text-sm font-nunito mb-2 animate-pulse">
                🎉 Skor Baru! Masukkan Nama!
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nama kamu..."
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                maxLength={15}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-400 outline-none font-nunito font-semibold text-gray-700 text-center"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all active:scale-95 font-nunito"
              >
                💾
              </button>
            </div>
          </div>
        )}

        {/* Show high scores */}
        {showScores && scores.length > 0 && (
          <div className="mb-4 max-h-40 overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-500 font-nunito mb-2">🏆 Top Scores</h3>
            <div className="space-y-1">
              {scores.slice(0, 5).map((s, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-lg text-sm">
                  <span className="font-bold text-gray-600 font-nunito">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} {s.name}
                  </span>
                  <span className="font-bold text-indigo-500 font-fredoka">{s.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-extrabold text-xl rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all font-fredoka"
          >
            🔄 Main Lagi!
          </button>
          <button
            onClick={onMenu}
            className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all font-nunito active:scale-95"
          >
            🏠 Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
