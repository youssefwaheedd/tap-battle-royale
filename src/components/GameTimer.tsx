
import React from 'react';

interface GameTimerProps {
  timeRemaining: number | null;
  gameState: 'waiting' | 'countdown' | 'playing' | 'results';
  countdown: number | null;
}

const GameTimer: React.FC<GameTimerProps> = ({ 
  timeRemaining, 
  gameState, 
  countdown 
}) => {
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '--:--';
    return seconds.toString().padStart(2, '0');
  };

  let display: React.ReactNode;

  switch (gameState) {
    case 'waiting':
      display = <span>Waiting for players...</span>;
      break;
    case 'countdown':
      display = (
        <div className="text-game-accent animate-pulse">
          Game starts in <span className="text-5xl font-bold">{countdown}</span>
        </div>
      );
      break;
    case 'playing':
      display = (
        <>
          Time left: <span className={`font-bold ${timeRemaining && timeRemaining <= 5 ? 'text-red-500' : ''}`}>
            {formatTime(timeRemaining)}s
          </span>
        </>
      );
      break;
    case 'results':
      display = <span>Game finished!</span>;
      break;
    default:
      display = <span>--:--</span>;
  }

  return (
    <div className="text-2xl md:text-3xl text-white text-center font-medium py-4">
      {display}
    </div>
  );
};

export default GameTimer;
