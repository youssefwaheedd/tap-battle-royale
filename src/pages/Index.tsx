/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  socketService,
  type Player,
  type GameStateUpdate,
} from "@/services/socketService";
import { PlayerNameInput } from "@/components/PlayerNameInput";
import GameButton from "@/components/GameButton";
import GameTimer from "@/components/GameTimer";
import Leaderboard from "@/components/Leaderboard";
import GameControls from "@/components/GameControls";
import GameResults from "@/components/GameResults";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const Index = () => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const [gameState, setGameState] = useState<
    "waiting" | "countdown" | "playing" | "results"
  >("waiting");
  const [players, setPlayers] = useState<Player[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFirstPlayer, setIsFirstPlayer] = useState(false);

  const { toast } = useToast();

  const handleJoinGame = (name: string) => {
    setIsConnecting(true);
    setPlayerName(name);

    try {
      socketService.connect(name);

      socketService.onConnect(() => {
        setIsConnecting(false);

        const socketId = (socketService as any).socket?.id;
        if (socketId) {
          setPlayerId(socketId);

          socketService.onPlayerJoined((player) => {
            if (players.length === 0 && player.id === socketId) {
              setIsFirstPlayer(true);
            }
          });
        }

        toast({
          title: "Connected!",
          description: "You've joined the game successfully.",
        });
      });

      socketService.onDisconnect(() => {
        toast({
          title: "Disconnected",
          description: "Connection to the game server lost.",
          variant: "destructive",
        });
      });

      socketService.onError((error) => {
        setIsConnecting(false);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      });

      socketService.onGameStateUpdate(handleGameStateUpdate);
    } catch (error) {
      setIsConnecting(false);
      toast({
        title: "Connection Failed",
        description: "Could not connect to the game server.",
        variant: "destructive",
      });
    }
  };

  const handleGameStateUpdate = (update: GameStateUpdate) => {
    setGameState(update.state);
    setPlayers(update.players);

    if (playerId) {
      const currentPlayer = update.players.find((p) => p.id === playerId);
      if (currentPlayer) {
        setTapCount(currentPlayer.taps);
      }
    }

    if (update.countdown !== undefined) {
      setCountdown(update.countdown);
    }

    if (update.timeRemaining !== undefined) {
      setTimeRemaining(update.timeRemaining);
    }
  };

  const handleTap = () => {
    if (gameState === "playing") {
      setTapCount((prevCount) => prevCount + 1);
      socketService.registerTap();
    }
  };

  const handleStartGame = () => {
    socketService.setPlayerReady();
  };

  const handlePlayAgain = () => {
    setGameState("waiting");
    setTapCount(0);
    setTimeRemaining(null);
    setCountdown(null);

    socketService.setPlayerReady();

    toast({
      title: "Ready for a new game",
      description: "Click Ready Up to join the next game.",
    });
  };

  useEffect(() => {
    return () => {
      socketService.disconnect();
    };
  }, []);

  if (!playerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-game-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            Tap Battle Royale
          </h1>
          <PlayerNameInput
            onJoin={handleJoinGame}
            isConnecting={isConnecting}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-background text-white p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-game-accent">
            Tap Battle Royale
          </h1>
          <div className="text-white text-opacity-80">
            Playing as <span className="font-semibold">{playerName}</span>
          </div>
        </div>
        <GameTimer
          gameState={gameState}
          timeRemaining={timeRemaining}
          countdown={countdown}
        />
      </header>

      <div className="max-w-4xl mx-auto">
        {gameState === "results" ? (
          <GameResults
            players={players}
            currentPlayerId={playerId}
            onPlayAgain={handlePlayAgain}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col">
              <GameControls
                onStartGame={handleStartGame}
                isHost={isFirstPlayer}
                gameState={gameState}
                players={players}
                currentPlayerId={playerId}
              />
              <div className="mt-6">
                <Leaderboard players={players} currentPlayerId={playerId} />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-center items-center">
              <GameButton
                isActive={gameState === "playing"}
                onTap={handleTap}
                tapCount={tapCount}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
