import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Question } from '../types';
import { speakEnglish, speakAnswer, speakFullSentence, isSpeaking, stopSpeaking } from '../tts';

interface Props {
  question: Question;
  onAnswer: (answer: string, correct: boolean, element?: HTMLElement) => void;
  disabled: boolean;
  feedback: 'correct' | 'wrong' | null;
  selectedAnswer: string | null;
  autoSpeak: boolean;
  nextCountdown: number;
}

const QuestionCard: React.FC<Props> = ({ question, onAnswer, disabled, feedback, selectedAnswer, autoSpeak, nextCountdown }) => {
  const [entered, setEntered] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setEntered(false);
    setShowHint(false);
    const t = requestAnimationFrame(() => setEntered(true));

    // Auto-speak the question when it appears
    if (autoSpeak) {
      const speechText = question.speechText || question.prompt;
      const timer = setTimeout(() => {
        setSpeaking(true);
        speakEnglish(speechText, () => setSpeaking(false));
      }, 400);
      return () => {
        cancelAnimationFrame(t);
        clearTimeout(timer);
        stopSpeaking();
        setSpeaking(false);
      };
    }

    return () => cancelAnimationFrame(t);
  }, [question.id, autoSpeak, question.speechText, question.prompt]);

  // Speak the answer after correct/wrong feedback, and auto-show hint
  // Untuk fill-blank: bacakan kalimat lengkap ("Yesterday, I went to school.")
  // Untuk lainnya: bacakan jawaban secara natural ("The answer is: Cat.")
  const speakTheAnswer = useCallback(() => {
    if (question.type === 'fill-blank') {
      // Bacakan kalimat lengkap dengan jawaban diisi
      speakFullSentence(question.prompt, question.answer);
    } else {
      speakAnswer(question.answer);
    }
  }, [question]);

  useEffect(() => {
    if (feedback === 'correct') {
      setShowHint(true);
      const timer = setTimeout(() => {
        speakTheAnswer();
      }, 400);
      return () => clearTimeout(timer);
    }
    if (feedback === 'wrong') {
      setShowHint(true);
      const timer = setTimeout(() => {
        speakTheAnswer();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [feedback, speakTheAnswer]);

  // Keyboard navigation: 1-4 keys
  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= 4 && question.options) {
        const idx = key - 1;
        if (idx < question.options.length) {
          const opt = question.options[idx];
          const btn = buttonsRef.current[idx];
          onAnswer(opt, opt === question.answer, btn || undefined);
        }
      }
      // Press S to speak
      if (e.key === 's' || e.key === 'S') {
        handleSpeak();
      }
      // Press H to toggle hint
      if (e.key === 'h' || e.key === 'H') {
        setShowHint(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [disabled, question, onAnswer]);

  const handleClick = useCallback((opt: string, idx: number) => {
    if (disabled) return;
    const btn = buttonsRef.current[idx];
    onAnswer(opt, opt === question.answer, btn || undefined);
  }, [disabled, question, onAnswer]);

  const handleSpeak = useCallback(() => {
    if (isSpeaking()) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const speechText = question.speechText || question.prompt;
    setSpeaking(true);
    speakEnglish(speechText, () => setSpeaking(false));
  }, [question]);

  const handleSpeakAnswer = useCallback(() => {
    if (isSpeaking()) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    if (question.type === 'fill-blank') {
      speakFullSentence(question.prompt, question.answer, () => setSpeaking(false));
    } else {
      speakAnswer(question.answer, () => setSpeaking(false));
    }
  }, [question]);

  const getButtonStyle = (opt: string) => {
    if (!feedback || selectedAnswer !== opt) {
      if (feedback && opt === question.answer) {
        return 'bg-green-400 border-green-500 text-green-900 scale-105 shadow-lg shadow-green-400/40';
      }
      return 'bg-white/95 hover:bg-white border-white/50 hover:border-white text-gray-800 hover:scale-[1.03] active:scale-95 shadow-md hover:shadow-lg';
    }
    if (feedback === 'correct') {
      return 'bg-green-400 border-green-500 text-green-900 scale-105 shadow-lg shadow-green-400/40';
    }
    return 'bg-red-400 border-red-500 text-red-900 scale-95 shadow-lg shadow-red-400/40 animate-shake';
  };

  const getTypeLabel = () => {
    switch (question.type) {
      case 'word-match': return '🖼️ Tebak Kata';
      case 'fill-blank': return '📝 Isi Titik-titik';
      case 'spelling': return '✏️ Ejaan';
      case 'translate': return '🌍 Terjemahkan';
      default: return '❓ Pertanyaan';
    }
  };

  return (
    <div className={`w-full max-w-lg mx-auto px-4 transition-all duration-500 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {/* Type label + Speaker button */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold font-nunito border border-white/20">
          {getTypeLabel()}
        </span>
        <button
          onClick={handleSpeak}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 border ${
            speaking
              ? 'bg-yellow-400 border-yellow-500 text-yellow-900 animate-pulse shadow-lg shadow-yellow-400/40'
              : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
          }`}
          title="Dengarkan soal (tekan S)"
        >
          {speaking ? '🔊' : '🔈'}
        </button>
      </div>

      {/* Emoji display */}
      {question.emoji && (
        <div className={`text-center mb-3 ${feedback === 'correct' ? 'animate-bounce-big' : ''}`}>
          <span className="text-7xl sm:text-8xl inline-block drop-shadow-lg">
            {question.emoji}
          </span>
        </div>
      )}

      {/* Question */}
      <div className="text-center mb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-fredoka drop-shadow-md leading-relaxed">
          {question.prompt}
        </h2>
        {question.hint && (
          <p className="text-white/60 text-sm mt-1 font-nunito">
            💡 Hint: {question.hint}
          </p>
        )}
      </div>

      {/* Indonesian Hint Section */}
      <div className="mb-4">
        {!showHint ? (
          <button
            onClick={() => setShowHint(true)}
            className="mx-auto flex items-center gap-1.5 px-4 py-2 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/30 rounded-xl text-amber-200 text-xs font-semibold font-nunito transition-all active:scale-95 backdrop-blur-sm"
          >
            <span>🇮🇩</span>
            <span>Lihat Petunjuk Bahasa Indonesia</span>
            <span className="text-[10px] opacity-60">(tekan H)</span>
          </button>
        ) : (
          <div className={`rounded-2xl px-4 py-3 backdrop-blur-sm animate-fade-in border ${
            feedback === 'correct'
              ? 'bg-green-500/20 border-green-400/40'
              : feedback === 'wrong'
              ? 'bg-red-500/15 border-red-400/30'
              : 'bg-amber-500/20 border-amber-400/30'
          }`}>
            <div className="flex items-start gap-2">
              <span className="text-lg mt-0.5">📖</span>
              <div className="flex-1">
                <p className="text-amber-100 text-sm font-semibold font-nunito leading-relaxed">
                  {question.indonesianHint}
                </p>

                {/* Feedback jawaban benar */}
                {feedback === 'correct' && (
                  <div className="mt-3 animate-fade-in">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-green-300 text-sm font-bold font-nunito">✅ Jawaban:</span>
                      <span className="bg-green-400/30 px-3 py-1 rounded-lg font-fredoka text-base text-green-200 font-bold">
                        {question.answer}
                      </span>
                      <button
                        onClick={handleSpeakAnswer}
                        className="w-7 h-7 rounded-full bg-green-400/30 hover:bg-green-400/50 flex items-center justify-center text-sm transition-all active:scale-90"
                        title="Dengarkan pengucapan"
                      >
                        🔊
                      </button>
                    </div>
                    <p className="text-green-200/70 text-xs font-nunito mt-1.5">
                      👆 Tekan 🔊 untuk dengarkan cara mengucapkan!
                    </p>
                  </div>
                )}

                {/* Feedback jawaban salah */}
                {feedback === 'wrong' && (
                  <div className="mt-3 animate-fade-in">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-red-300 text-sm font-bold font-nunito">❌ Jawaban yang benar:</span>
                      <span className="bg-green-400/30 px-3 py-1 rounded-lg font-fredoka text-base text-green-200 font-bold">
                        {question.answer}
                      </span>
                      <button
                        onClick={handleSpeakAnswer}
                        className="w-7 h-7 rounded-full bg-green-400/30 hover:bg-green-400/50 flex items-center justify-center text-sm transition-all active:scale-90"
                        title="Dengarkan pengucapan"
                      >
                        🔊
                      </button>
                    </div>
                    <p className="text-red-200/70 text-xs font-nunito mt-1.5">
                      👆 Tekan 🔊 untuk dengarkan cara mengucapkan! Baca petunjuk di atas ya!
                    </p>
                  </div>
                )}
              </div>
              {!feedback && (
                <button
                  onClick={() => setShowHint(false)}
                  className="text-amber-300/60 hover:text-amber-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {question.options?.map((opt, idx) => (
          <button
            key={`${question.id}-${opt}`}
            ref={el => { buttonsRef.current[idx] = el; }}
            onClick={() => handleClick(opt, idx)}
            disabled={disabled}
            className={`relative px-4 py-4 sm:py-5 rounded-2xl border-2 font-bold text-base sm:text-lg transition-all duration-200 font-fredoka ${getButtonStyle(opt)} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="absolute top-1.5 left-2.5 text-[10px] font-semibold opacity-40 font-nunito">
              {idx + 1}
            </span>
            {opt}
            {feedback === 'correct' && selectedAnswer === opt && (
              <span className="absolute -top-2 -right-2 text-2xl animate-pop">✅</span>
            )}
            {feedback === 'wrong' && selectedAnswer === opt && (
              <span className="absolute -top-2 -right-2 text-2xl animate-pop">❌</span>
            )}
          </button>
        ))}
      </div>

      {/* Wrong answer correction (fallback when hint is closed) */}
      {feedback === 'wrong' && !showHint && (
        <div className="text-center mt-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/30 border border-green-400/40 rounded-xl backdrop-blur-sm">
            <span className="text-white font-bold font-nunito text-sm">
              ✅ Jawaban benar: <span className="text-green-300 font-fredoka">{question.answer}</span>
            </span>
            <button
              onClick={handleSpeakAnswer}
              className="w-7 h-7 rounded-full bg-green-400/30 hover:bg-green-400/50 flex items-center justify-center text-sm transition-all active:scale-90"
            >
              🔊
            </button>
          </div>
        </div>
      )}

      {/* Next question countdown indicator */}
      {feedback && nextCountdown > 0 && (
        <div className="mt-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <div className="flex-1 max-w-[200px] h-2 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/50 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(nextCountdown / 5) * 100}%` }}
              />
            </div>
            <span className="text-white/60 text-xs font-nunito font-semibold min-w-[90px] text-center">
              ⏳ Soal berikutnya {nextCountdown}s
            </span>
          </div>
          <p className="text-white/40 text-[10px] font-nunito text-center mt-1">
            📖 Baca petunjuk di atas & dengarkan pengucapannya!
          </p>
        </div>
      )}

      {/* Keyboard hints (desktop) - only when no feedback */}
      {!feedback && (
        <div className="hidden sm:flex justify-center gap-4 mt-4">
          <span className="text-white/40 text-xs font-nunito">
            ⌨️ 1-4 menjawab
          </span>
          <span className="text-white/40 text-xs font-nunito">
            🔊 S dengarkan
          </span>
          <span className="text-white/40 text-xs font-nunito">
            🇮🇩 H petunjuk
          </span>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
