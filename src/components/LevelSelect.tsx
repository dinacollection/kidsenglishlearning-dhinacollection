import React from 'react';
import { Difficulty } from '../types';
import { getDifficultyConfig } from '../gameData';

interface Props {
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
}

const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

const LevelSelect: React.FC<Props> = ({ onSelect, onBack }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-500/10 rounded-full blur-xl" />

      <button
        onClick={onBack}
        className="absolute top-6 left-6 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold backdrop-blur-sm transition-all font-nunito active:scale-95 border border-white/20"
      >
        ← Kembali
      </button>

      <div className="text-center mb-8">
        {/* Brand */}
        <div className="mb-5">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl px-5 py-2 shadow-lg shadow-yellow-500/20">
            <span className="text-yellow-900 font-extrabold text-base sm:text-lg font-fredoka tracking-wide">
              ✨ DCdhinacollection ✨
            </span>
          </div>
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-white font-fredoka drop-shadow-md mb-3">
          Pilih Level
        </h2>
        <p className="text-white/80 text-lg font-nunito font-semibold">
          Pilih level kesulitan! 🎯
        </p>
        <p className="text-white/60 text-xs font-nunito mt-2">
          🔊 Setiap soal dilengkapi suara & 🇮🇩 petunjuk Bahasa Indonesia
        </p>
      </div>

      <div className="grid gap-5 w-full max-w-md">
        {difficulties.map((diff, idx) => {
          const config = getDifficultyConfig(diff);
          return (
            <button
              key={diff}
              onClick={() => onSelect(diff)}
              className="group relative w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] active:scale-95"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`bg-gradient-to-r ${config.color} p-6 sm:p-7`}>
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-white/80 text-sm font-semibold font-nunito mb-1">
                      Level {idx + 1}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-fredoka">
                      {config.label}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm mt-1 font-nunito">
                      {config.description}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-semibold font-nunito">
                        ❤️ {config.lives} nyawa
                      </span>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-semibold font-nunito">
                        ⏱️ {config.timePerQuestion}s
                      </span>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-semibold font-nunito">
                        +{config.pointsPerCorrect}pts
                      </span>
                    </div>
                  </div>
                  <div className="text-5xl sm:text-6xl transform group-hover:scale-110 transition-transform">
                    {diff === 'easy' ? '🌱' : diff === 'medium' ? '🌿' : '🌳'}
                  </div>
                </div>
              </div>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelect;
