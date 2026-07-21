import React, { useMemo } from 'react';
import { HighScore, Difficulty } from '../types';
import { getHighScores } from '../highScores';

interface Props {
  onBack: () => void;
}

const diffLabels: Record<Difficulty, { label: string; emoji: string; color: string }> = {
  easy: { label: 'Mudah', emoji: '🌱', color: 'text-green-500' },
  medium: { label: 'Sedang', emoji: '🌿', color: 'text-yellow-500' },
  hard: { label: 'Sulit', emoji: '🌳', color: 'text-red-500' },
};

const HighScoreScreen: React.FC<Props> = ({ onBack }) => {
  const scores: HighScore[] = useMemo(() => getHighScores(), []);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-red-600/10 rounded-full blur-xl" />

      <button
        onClick={onBack}
        className="absolute top-6 left-6 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold backdrop-blur-sm transition-all font-nunito active:scale-95 border border-white/20"
      >
        ← Kembali
      </button>

      <div className="text-center mb-8">
        {/* Brand */}
        <div className="mb-4">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl px-5 py-2 shadow-lg shadow-yellow-500/20">
            <span className="text-yellow-900 font-extrabold text-base sm:text-lg font-fredoka tracking-wide">
              ✨ DCdhinacollection ✨
            </span>
          </div>
        </div>
        <div className="text-6xl mb-3">🏆</div>
        <h2 className="text-4xl font-extrabold text-white font-fredoka drop-shadow-md">
          Skor Tertinggi
        </h2>
        <p className="text-white/80 font-nunito font-semibold mt-1">High Scores</p>
      </div>

      <div className="w-full max-w-md">
        {scores.length === 0 ? (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-white font-bold text-lg font-fredoka">Belum ada skor!</p>
            <p className="text-white/70 font-nunito text-sm mt-1">Mainkan game untuk merekam skor!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {scores.slice(0, 10).map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-sm border transition-all ${
                  i === 0
                    ? 'bg-yellow-400/30 border-yellow-300/40 shadow-lg'
                    : i === 1
                    ? 'bg-gray-300/20 border-gray-300/30'
                    : i === 2
                    ? 'bg-amber-600/20 border-amber-500/30'
                    : 'bg-white/10 border-white/15'
                }`}
              >
                <div className="text-2xl w-8 text-center">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span className="text-white/50 text-lg font-bold font-fredoka">{i + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold font-nunito truncate">{s.name}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-semibold ${diffLabels[s.difficulty].color}`}>
                      {diffLabels[s.difficulty].emoji} {diffLabels[s.difficulty].label}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/50 font-nunito">{s.date}</span>
                  </div>
                </div>
                <div className="text-xl font-extrabold text-yellow-300 font-fredoka">
                  {s.score}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HighScoreScreen;
