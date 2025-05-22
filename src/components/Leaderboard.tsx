
import React from 'react';
import { Player } from '@/services/socketService';

interface LeaderboardProps {
  players: Player[];
  currentPlayerId?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, currentPlayerId }) => {
  // Sort players by tap count in descending order
  const sortedPlayers = [...players].sort((a, b) => b.taps - a.taps);

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-white">Leaderboard</h2>
      
      {sortedPlayers.length === 0 ? (
        <p className="text-center text-gray-300">No players yet</p>
      ) : (
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => (
            <div 
              key={player.id} 
              className={`
                flex justify-between items-center p-3 rounded-md
                ${currentPlayerId === player.id ? 'bg-game-secondary bg-opacity-50' : 'bg-slate-700'}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
