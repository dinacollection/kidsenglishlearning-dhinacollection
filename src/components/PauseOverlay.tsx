import React from 'react';
import { Difficulty } from '../types';
import { getDifficultyConfig } from '../gameData';

interface Props {
  score: number;
  difficulty: Difficulty;
  onResume: () => void;
  onQuit: () => void;
}

const PauseOverlay: React.FC<Props> = ({ score, difficulty, onResume, onQuit }) => {
  const config = getDifficultyConfig(difficulty);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl p-8 mx-6 max-w-sm w-full shadow-2xl text-center animate-pop">
        {/* Brand */}
        <div className="mb-4">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl px-4 py-1.5 shadow-md">
            <span className="text-yellow-900 font-extrabold text-sm font-fredoka tracking-wide">
              ✨ DCdhinacollection ✨
            </span>
          </div>
        </div>

        {/* Icon */}
        <div className="text-6xl mb-4">⏸️</div>

        <h2 className="text-3xl font-extrabold text-gray-800 font-fredoka mb-2">
          Game Dijeda
        </h2>
        <p className="text-gray-500 font-nunito font-semibold mb-1">
          Level: {config.label} ({config.sublabel})
        </p>
        <p className="text-gray-400 font-nunito mb-6">
          Skor saat ini: <span className="font-bold text-indigo-500">{score}</span>
        </p>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-extrabold text-xl rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all font-fredoka"
          >
            ▶️ Lanjutkan
          </button>
          <button
            onClick={onQuit}
            className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-base rounded-2xl transition-all font-nunito active:scale-95"
          >
            🏠 Keluar
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400 font-nunito">
          Tekan ESC atau Space untuk lanjut
        </p>
      </div>
    </div>
  );
};

export default PauseOverlay;
