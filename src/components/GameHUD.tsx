import React from 'react';
import { Difficulty } from '../types';
import { getDifficultyConfig } from '../gameData';

interface Props {
  score: number;
  lives: number;
  maxLives: number;
  streak: number;
  questionNumber: number;
  totalQuestions: number;
  difficulty: Difficulty;
  timeLeft: number;
  maxTime: number;
  onPause: () => void;
  comboText: string;
}

const GameHUD: React.FC<Props> = ({
  score,
  lives,
  maxLives,
  streak,
  questionNumber,
  totalQuestions,
  difficulty,
  timeLeft,
  maxTime,
  onPause,
  comboText,
}) => {
  const config = getDifficultyConfig(difficulty);
  const timePercent = (timeLeft / maxTime) * 100;
  const isLowTime = timeLeft <= 5;

  return (
    <div className="w-full px-4 pt-3 pb-2">
      {/* Brand bar */}
      <div className="flex items-center justify-center mb-2">
        <div className="bg-gradient-to-r from-yellow-400/90 to-amber-500/90 rounded-full px-4 py-1 shadow-md shadow-yellow-500/20 border border-yellow-300/40">
          <span className="text-yellow-900 font-extrabold text-xs sm:text-sm font-fredoka tracking-wide">
            ✨ DCdhinacollection ✨
          </span>
        </div>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        {/* Pause button */}
        <button
          onClick={onPause}
          className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white text-lg backdrop-blur-sm active:scale-90 transition-all border border-white/20"
        >
          ⏸️
        </button>

        {/* Score */}
        <div className="flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <span className="text-white font-extrabold text-lg font-fredoka">
              ⭐ {score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Lives */}
        <div className="flex gap-0.5">
          {Array.from({ length: maxLives }).map((_, i) => (
            <span
              key={i}
              className={`text-xl transition-all duration-300 ${
                i < lives ? 'scale-100 opacity-100' : 'scale-75 opacity-30 grayscale'
              }`}
            >
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Progress and Timer */}
      <div className="flex items-center gap-3">
        {/* Question counter */}
        <div className="text-white/70 text-xs font-semibold font-nunito whitespace-nowrap">
          {questionNumber}/{totalQuestions}
        </div>

        {/* Timer bar */}
        <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isLowTime ? 'bg-red-400 animate-pulse' : 'bg-green-400'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>

        {/* Timer text */}
        <div className={`text-sm font-bold font-fredoka min-w-[2rem] text-right ${
          isLowTime ? 'text-red-300 animate-pulse' : 'text-white/90'
        }`}>
          {timeLeft}s
        </div>
      </div>

      {/* Streak / Combo indicator */}
      <div className="flex items-center justify-between mt-1 h-6">
        <div className={`${config.bgColor} ${config.textColor} text-xs font-bold px-2 py-0.5 rounded-full font-nunito`}>
          {config.emoji} {config.sublabel}
        </div>
        {streak >= 2 && (
          <div className="text-yellow-300 font-extrabold text-sm font-fredoka animate-bounce-gentle">
            🔥 {streak}x Streak!
          </div>
        )}
        {comboText && (
          <div className="text-white font-bold text-xs font-nunito animate-fade-in">
            {comboText}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(GameHUD);
