import React, { useState, useEffect } from 'react';

interface Props {
  onStart: () => void;
  onHighScores: () => void;
}

const floatingEmojis = ['📚', '✏️', '🎓', '⭐', '🌟', '💡', '🎨', '🔤', 'A', 'B', 'C', '🍎', '🐱', '🌈'];

const StartScreen: React.FC<Props> = ({ onStart, onHighScores }) => {
  const [animate, setAnimate] = useState(false);
  const [bgEmojis] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      emoji: floatingEmojis[i % floatingEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      size: 20 + Math.random() * 24,
    }))
  );

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Floating background emojis */}
      {bgEmojis.map((e, i) => (
        <div
          key={i}
          className="absolute opacity-15 pointer-events-none select-none"
          style={{
            left: `${e.x}%`,
            top: `${e.y}%`,
            fontSize: e.size,
            animation: `float ${e.duration}s ease-in-out ${e.delay}s infinite alternate`,
          }}
        >
          {e.emoji}
        </div>
      ))}

      {/* Decorative glow circles */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main content */}
      <div className={`text-center px-6 transition-all duration-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* ===== BRAND LOGO - PROMINENT ===== */}
        <div className="mb-6">
          {/* Brand shield / badge */}
          <div className="inline-block relative">
            <div className="bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 rounded-2xl px-6 py-3 shadow-2xl shadow-yellow-500/30 animate-pulse-glow">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-yellow-900/60 tracking-[0.2em] uppercase font-nunito leading-none">
                    Presented by
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-yellow-900 font-fredoka tracking-wide leading-tight">
                    DCdhina<span className="text-orange-800">collection</span>
                  </div>
                </div>
                <span className="text-2xl">✨</span>
              </div>
            </div>
            {/* Sparkle decorations */}
            <div className="absolute -top-2 -left-2 text-xl animate-bounce-gentle">⭐</div>
            <div className="absolute -top-2 -right-2 text-xl animate-bounce-gentle" style={{ animationDelay: '0.3s' }}>⭐</div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent rounded-full" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-3">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white drop-shadow-lg font-fredoka leading-tight">
            Belajar
          </h1>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-yellow-300 drop-shadow-lg font-fredoka leading-tight">
            Bahasa Inggris
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-white/90 text-lg sm:text-xl mb-2 font-nunito font-semibold">
          🎮 Game Edukasi untuk Anak-Anak 🎮
        </p>
        <p className="text-white/70 text-sm sm:text-base mb-4 font-nunito">
          Belajar sambil bermain!
        </p>

        {/* Features badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-5 max-w-xs mx-auto">
          <span className="px-3 py-1.5 bg-white/15 rounded-full text-white/90 text-xs font-semibold font-nunito border border-white/20 backdrop-blur-sm">
            🔊 Suara Pengucapan
          </span>
          <span className="px-3 py-1.5 bg-white/15 rounded-full text-white/90 text-xs font-semibold font-nunito border border-white/20 backdrop-blur-sm">
            🇮🇩 Petunjuk Indonesia
          </span>
          <span className="px-3 py-1.5 bg-white/15 rounded-full text-white/90 text-xs font-semibold font-nunito border border-white/20 backdrop-blur-sm">
            ⭐ 3 Level Kesulitan
          </span>
        </div>

        {/* Mascot */}
        <div className="text-7xl sm:text-8xl mb-5 animate-bounce-slow">
          🦉
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={onStart}
            className="group relative w-72 sm:w-80 mx-auto block px-8 py-5 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-extrabold text-2xl rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 font-fredoka overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              📚 MULAI BELAJAR
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 to-transparent" />
          </button>

          <button
            onClick={onHighScores}
            className="w-72 sm:w-80 mx-auto block px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 font-nunito backdrop-blur-sm border border-white/30"
          >
            🏆 Skor Tertinggi
          </button>
        </div>

        {/* Footer with brand */}
        <div className="mt-8 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-[1px] bg-white/20" />
            <span className="text-white/60 text-xs font-bold font-fredoka tracking-wider">
              DCdhinacollection
            </span>
            <div className="w-8 h-[1px] bg-white/20" />
          </div>
          <p className="text-white/40 text-[10px] font-nunito">
            © 2025 DCdhinacollection • Made with ❤️ for Kids
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
