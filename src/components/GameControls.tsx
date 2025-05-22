import React from "react";
import { Button } from "@/components/ui/button";
import { Player } from "@/services/socketService";

interface GameControlsProps {
  onStartGame: () => void;
  isHost: boolean;
  gameState: "waiting" | "countdown" | "playing" | "results";
  players: Player[];
  currentPlayerId: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  onStartGame,
  isHost,
  gameState,
  players,
  currentPlayerId,
}) => {
  if (gameState !== "waiting") {
    return null;
  }

  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const isReady = currentPlayer?.isReady || false;
  const allPlayersReady = players.every((player) => player.isReady);
  const playerCount = players.length;

  return (
    <div className="flex flex-col items-center mt-6">
      <Button
        className={`px-8 py-4 text-lg ${
          isReady
            ? "bg-green-600 hover:bg-green-700"
            : "bg-game-primary hover:bg-game-secondary"
        }`}
        onClick={onStartGame}
        disabled={isReady}
      >
        {isReady ? "Ready!" : "Ready Up"}
      </Button>
      <p className="text-sm text-gray-300 mt-2">
        {playerCount < 2
          ? "Waiting for another player..."
          : allPlayersReady
          ? "All players ready!"
          : "Waiting for other players to ready up..."}
      </p>
    </div>
  );
};

export default GameControls;
