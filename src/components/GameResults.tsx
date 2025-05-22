
import React from 'react';
import { Player } from '@/services/socketService';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface GameResultsProps {
  players: Player[];
  currentPlayerId: string;
  onPlayAgain: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({ players, currentPlayerId, onPlayAgain }) => {
  // Sort players by tap count in descending order
  const sortedPlayers = [...players].sort((a, b) => b.taps - a.taps);
  
  // Find winner (could be multiple in case of a tie)
  const highestScore = sortedPlayers.length > 0 ? sortedPlayers[0].taps : 0;
  const winners = sortedPlayers.filter(player => player.taps === highestScore);
  
  // Check if current player is a winner
  const isCurrentPlayerWinner = winners.some(player => player.id === currentPlayerId);
  
  // Find current player's position
  const currentPlayerRank = sortedPlayers.findIndex(player => player.id === currentPlayerId) + 1;

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Game Results</h2>
        
        {winners.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl text-gray-200 mb-4">
              {winners.length > 1 ? "It's a tie!" : "Winner!"}
            </h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {winners.map(winner => (
                <motion.div
                  key={winner.id}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className={`
                    p-4 rounded-lg 
                    ${winner.id === currentPlayerId ? 'bg-game-primary' : 'bg-game-secondary'}
                  `}
                >
                  <div className="text-xl font-bold text-white">{winner.name}</div>
                  <div className="text-3xl font-extrabold text-white mt-1">{winner.taps}</div>
                  <div className="text-sm text-gray-200">taps</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!isCurrentPlayerWinner && (
          <div className="mb-6 p-4 bg-slate-700 rounded-lg inline-block">
            <p className="text-white">
              You placed <span className="font-bold text-game-accent">{currentPlayerRank.toString()}</span>
              {currentPlayerRank === 2 ? "nd" : currentPlayerRank === 3 ? "rd" : "th"}
            </p>
            <p className="text-2xl font-bold text-white mt-1">
              {sortedPlayers.find(p => p.id === currentPlayerId)?.taps || 0} taps
            </p>
          </div>
        )}
      </motion.div>

      <div className="space-y-2 mb-8">
        <h3 className="text-xl font-bold text-white mb-3">All Players</h3>
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              flex justify-between items-center p-3 rounded-md
              ${index === 0 ? 'bg-yellow-500 bg-opacity-20' : 
                index === 1 ? 'bg-gray-400 bg-opacity-20' :
                index === 2 ? 'bg-amber-700 bg-opacity-20' : 'bg-slate-700'}
              ${currentPlayerId === player.id ? 'border-2 border-game-accent' : ''}
            `}
          >
            <div className="flex items-center">
              <span className="w-6 text-center font-medium text-gray-300">#{index + 1}</span>
              <span className="ml-3 font-medium text-white">{player.name}</span>
              {currentPlayerId === player.id && (
                <span className="ml-2 text-xs bg-game-primary px-2 py-0.5 rounded text-white">You</span>
              )}
            </div>
            <span className="font-bold text-game-accent">{player.taps}</span>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center">
        <Button 
          onClick={onPlayAgain}
          className="bg-game-primary hover:bg-game-secondary px-8 py-2 text-lg"
        >
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default GameResults;
