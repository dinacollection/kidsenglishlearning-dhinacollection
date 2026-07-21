import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Difficulty } from './types';
import { playClick, playStart } from './sounds';
import { preloadVoices } from './tts';
import StartScreen from './components/StartScreen';
import LevelSelect from './components/LevelSelect';
import GameScreen from './components/GameScreen';
import HighScoreScreen from './components/HighScoreScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  // Preload TTS voices early
  useEffect(() => {
    preloadVoices();
  }, []);

  const handleStartClick = useCallback(() => {
    setGameState('levelSelect');
    playClick();
  }, []);

  const handleLevelSelect = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setGameState('playing');
    playStart();
  }, []);

  const handleShowHighScores = useCallback(() => {
    setGameState('gameover'); // reuse as high score view
    playClick();
  }, []);

  const handleBack = useCallback(() => {
    setGameState('start');
    playClick();
  }, []);

  const handleQuit = useCallback(() => {
    setGameState('start');
    playClick();
  }, []);

  switch (gameState) {
    case 'start':
      return <StartScreen onStart={handleStartClick} onHighScores={handleShowHighScores} />;
    case 'levelSelect':
      return <LevelSelect onSelect={handleLevelSelect} onBack={handleBack} />;
    case 'playing':
      return <GameScreen difficulty={difficulty} onQuit={handleQuit} />;
    case 'gameover':
      return <HighScoreScreen onBack={handleBack} />;
    default:
      return <StartScreen onStart={handleStartClick} onHighScores={handleShowHighScores} />;
  }
};

export default App;
