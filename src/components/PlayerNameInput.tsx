
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PlayerNameInputProps {
  onJoin: (name: string) => void;
  isConnecting: boolean;
}

export const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ onJoin, isConnecting }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onJoin(playerName.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg bg-slate-800 shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Enter the Tap Battle!
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-200 mb-1">
            Your Name
          </label>
          <Input
            id="playerName"
            type="text"
            placeholder="Enter your name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full"
            disabled={isConnecting}
            maxLength={15}
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-game-primary hover:bg-game-secondary transition-colors"
          disabled={isConnecting || !playerName.trim()}
        >
          {isConnecting ? 'Connecting...' : 'Join Game'}
        </Button>
      </form>
    </div>
  );
};
