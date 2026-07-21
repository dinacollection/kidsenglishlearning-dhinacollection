import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, Question } from '../types';
import { getQuestions, getDifficultyConfig } from '../gameData';
import { playCorrect, playWrong, playClick, playGameOver, playStreak, playCountdown, playLevelUp } from '../sounds';
import { stopSpeaking, preloadVoices } from '../tts';
import { useParticles } from '../useParticles';
import ParticleLayer from './ParticleLayer';
import GameHUD from './GameHUD';
import QuestionCard from './QuestionCard';
import PauseOverlay from './PauseOverlay';
import GameOverScreen from './GameOverScreen';

interface Props {
  difficulty: Difficulty;
  onQuit: () => void;
}

const CORRECT_EMOJIS = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '💯', '👏', '🥳'];
const CORRECT_COLORS = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

const GameScreen: React.FC<Props> = ({ difficulty, onQuit }) => {
  const config = getDifficultyConfig(difficulty);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.lives);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timePerQuestion);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [comboText, setComboText] = useState('');
  const [shaking, setShaking] = useState(false);
  const [bgGradient, setBgGradient] = useState('from-blue-500 via-indigo-500 to-purple-600');
  const [countdownActive, setCountdownActive] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [nextCountdown, setNextCountdown] = useState(0); // countdown visual sebelum soal berikutnya
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const handleTimeUpRef = useRef<() => void>(() => {});
  const { particles, spawnParticles, clearParticles } = useParticles();

  // Initialize questions and preload TTS voices
  useEffect(() => {
    setQuestions(getQuestions(difficulty));
    preloadVoices();
    return () => {
      stopSpeaking();
    };
  }, [difficulty]);

  // Countdown before start
  useEffect(() => {
    if (!countdownActive) return;
    if (countdown <= 0) {
      setCountdownActive(false);
      return;
    }
    playCountdown();
    const t = setTimeout(() => setCountdown(c => c - 1), 800);
    return () => clearTimeout(t);
  }, [countdown, countdownActive]);

  // Timer
  useEffect(() => {
    if (isPaused || isGameOver || feedback || countdownActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - count as wrong
          handleTimeUpRef.current();
          return config.timePerQuestion;
        }
        if (prev <= 6) playCountdown();
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isGameOver, feedback, currentIdx, countdownActive, config.timePerQuestion]);

  // Background color cycling
  useEffect(() => {
    const gradients = [
      'from-blue-500 via-indigo-500 to-purple-600',
      'from-purple-500 via-pink-500 to-rose-500',
      'from-teal-500 via-cyan-500 to-blue-500',
      'from-green-500 via-emerald-500 to-teal-500',
      'from-orange-500 via-amber-500 to-yellow-500',
    ];
    setBgGradient(gradients[currentIdx % gradients.length]);
  }, [currentIdx]);

  // Keyboard: ESC/Space for pause
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isGameOver) return;
        setIsPaused(p => {
          if (!p) stopSpeaking(); // Stop TTS when pausing
          return !p;
        });
        playClick();
      }
      if (e.key === ' ' && isPaused) {
        e.preventDefault();
        setIsPaused(false);
        playClick();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPaused, isGameOver]);

  const handleTimeUp = useCallback(() => {
    setFeedback('wrong');
    setSelectedAnswer(null);
    setStreak(0);
    setTotalAnswered(t => t + 1);
    setLives(l => {
      const newLives = l - 1;
      if (newLives <= 0) {
        setTimeout(() => {
          setIsGameOver(true);
          playGameOver();
        }, 5000);
      }
      return newLives;
    });
    playWrong();
    triggerShake();

    // Jeda 5 detik agar anak bisa baca jawaban & petunjuk
    const TIMEUP_DELAY = 5000;
    setNextCountdown(5);
    const cdInterval = setInterval(() => {
      setNextCountdown(prev => {
        if (prev <= 1) { clearInterval(cdInterval); return 0; }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(cdInterval);
      setNextCountdown(0);
      setFeedback(null);
      setSelectedAnswer(null);
      setTimeLeft(config.timePerQuestion);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        setIsGameOver(true);
        playLevelUp();
      }
    }, TIMEUP_DELAY);
  }, [currentIdx, questions.length, config.timePerQuestion]);

  // Keep ref up to date
  useEffect(() => {
    handleTimeUpRef.current = handleTimeUp;
  }, [handleTimeUp]);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
  };

  const handleAnswer = useCallback((answer: string, correct: boolean, element?: HTMLElement) => {
    if (feedback) return;

    setSelectedAnswer(answer);
    setTotalAnswered(t => t + 1);

    if (correct) {
      setFeedback('correct');
      playCorrect();

      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(ms => Math.max(ms, newStreak));
      setCorrectCount(c => c + 1);

      // Score calculation with streak bonus
      const timeBonus = Math.floor(timeLeft * 2);
      const streakBonus = newStreak >= 3 ? config.streakBonus * Math.min(newStreak, 10) : 0;
      const points = config.pointsPerCorrect + timeBonus + streakBonus;
      setScore(s => s + points);

      // Combo text
      if (newStreak >= 5) {
        setComboText(`🔥 AMAZING! +${points}`);
        playStreak();
      } else if (newStreak >= 3) {
        setComboText(`⚡ COMBO! +${points}`);
      } else {
        setComboText(`+${points}`);
      }

      // Particles from button position
      if (element) {
        const rect = element.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        spawnParticles(cx, cy, newStreak >= 3 ? 20 : 12, CORRECT_COLORS, CORRECT_EMOJIS);
      } else {
        spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 12, CORRECT_COLORS, CORRECT_EMOJIS);
      }

      // Jeda 5 detik agar anak sempat baca petunjuk Indonesia & dengar pengucapan
      const CORRECT_DELAY = 5000;
      setNextCountdown(5);
      const cdInterval = setInterval(() => {
        setNextCountdown(prev => {
          if (prev <= 1) { clearInterval(cdInterval); return 0; }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => {
        clearInterval(cdInterval);
        setNextCountdown(0);
        setFeedback(null);
        setSelectedAnswer(null);
        setComboText('');
        setTimeLeft(config.timePerQuestion);
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(i => i + 1);
        } else {
          setIsGameOver(true);
          playLevelUp();
        }
      }, CORRECT_DELAY);
    } else {
      setFeedback('wrong');
      playWrong();
      triggerShake();
      setStreak(0);

      // Spawn sad particles
      if (element) {
        const rect = element.getBoundingClientRect();
        spawnParticles(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          6,
          ['#FF6B6B', '#EE5A24', '#ED4C67'],
          ['💔', '😢']
        );
      }

      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setTimeout(() => {
            setIsGameOver(true);
            playGameOver();
          }, 5000);
        }
        return newLives;
      });

      // Jeda 5.5 detik agar anak sempat baca jawaban benar & petunjuk Indonesia
      const WRONG_DELAY = 5500;
      setNextCountdown(5);
      const cdInterval2 = setInterval(() => {
        setNextCountdown(prev => {
          if (prev <= 1) { clearInterval(cdInterval2); return 0; }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => {
        clearInterval(cdInterval2);
        setNextCountdown(0);
        setFeedback(null);
        setSelectedAnswer(null);
        setTimeLeft(config.timePerQuestion);
        if (currentIdx < questions.length - 1 && lives > 1) {
          setCurrentIdx(i => i + 1);
        }
      }, WRONG_DELAY);
    }
  }, [feedback, streak, timeLeft, config, currentIdx, questions.length, lives, spawnParticles]);

  const handleRestart = useCallback(() => {
    setQuestions(getQuestions(difficulty));
    setCurrentIdx(0);
    setScore(0);
    setLives(config.lives);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalAnswered(0);
    setTimeLeft(config.timePerQuestion);
    setIsGameOver(false);
    setFeedback(null);
    setSelectedAnswer(null);
    setComboText('');
    clearParticles();
    setCountdown(3);
    setCountdownActive(true);
    playClick();
  }, [difficulty, config, clearParticles]);

  const currentQuestion = questions[currentIdx];

  if (!currentQuestion) return null;

  return (
    <div className={`min-h-[100dvh] flex flex-col bg-gradient-to-br ${bgGradient} transition-colors duration-1000 relative ${shaking ? 'animate-shake' : ''}`}>
      {/* Decorative floating shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-white/5 rounded-full blur-2xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute top-[60%] right-[5%] w-48 h-48 bg-white/5 rounded-full blur-2xl" style={{ animation: 'float 8s ease-in-out 2s infinite' }} />
        <div className="absolute bottom-[15%] left-[15%] w-24 h-24 bg-white/5 rounded-full blur-xl" style={{ animation: 'float 5s ease-in-out 1s infinite' }} />
      </div>

      {/* Brand watermark - bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none select-none z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 border border-white/10">
          <span className="text-white/40 text-[11px] font-bold font-fredoka tracking-wider">
            DCdhinacollection
          </span>
        </div>
      </div>

      <ParticleLayer particles={particles} />

      {/* Countdown overlay */}
      {countdownActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="text-center animate-pop">
            {/* Brand in countdown */}
            <div className="mb-6">
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl px-5 py-2 shadow-lg shadow-yellow-500/30">
                <span className="text-yellow-900 font-extrabold text-lg sm:text-xl font-fredoka tracking-wide">
                  DCdhinacollection
                </span>
              </div>
            </div>
            <div className="text-[120px] font-extrabold text-white font-fredoka drop-shadow-2xl animate-pulse">
              {countdown > 0 ? countdown : '🚀'}
            </div>
            <p className="text-white/80 text-xl font-semibold font-nunito mt-4">
              {countdown > 0 ? 'Bersiap...' : 'Mulai!'}
            </p>
          </div>
        </div>
      )}

      {/* HUD */}
      <GameHUD
        score={score}
        lives={lives}
        maxLives={config.lives}
        streak={streak}
        questionNumber={currentIdx + 1}
        totalQuestions={questions.length}
        difficulty={difficulty}
        timeLeft={timeLeft}
        maxTime={config.timePerQuestion}
        onPause={() => { setIsPaused(true); stopSpeaking(); playClick(); }}
        comboText={comboText}
      />

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center pb-8">
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          disabled={!!feedback || countdownActive}
          feedback={feedback}
          selectedAnswer={selectedAnswer}
          autoSpeak={!countdownActive}
          nextCountdown={nextCountdown}
        />
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <PauseOverlay
          score={score}
          difficulty={difficulty}
          onResume={() => { setIsPaused(false); playClick(); }}
          onQuit={onQuit}
        />
      )}

      {/* Game Over */}
      {isGameOver && (
        <GameOverScreen
          score={score}
          correctAnswers={correctCount}
          totalAnswered={totalAnswered}
          streak={maxStreak}
          difficulty={difficulty}
          onRestart={handleRestart}
          onMenu={onQuit}
        />
      )}
    </div>
  );
};

export default GameScreen;
