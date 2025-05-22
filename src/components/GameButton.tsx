import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface GameButtonProps {
  isActive: boolean;
  onTap: () => void;
  tapCount: number;
}

const GameButton: React.FC<GameButtonProps> = ({
  isActive,
  onTap,
  tapCount,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTap = () => {
    if (isActive) {
      onTap();
      setIsAnimating(true);
    }
  };

  // Handle keyboard press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent repeated keydown events while key is held
      if (e.repeat) return;

      // Only allow spacebar to trigger a tap when active
      if (isActive && e.code === "Space") {
        onTap();
        setIsAnimating(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, onTap]);

  // Reset animation
  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => setIsAnimating(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating]);

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={handleTap}
        disabled={!isActive}
        className={`
          w-48 h-48 md:w-64 md:h-64 rounded-full text-4xl md:text-5xl font-bold
          transition-all duration-100 shadow-lg
          ${
            isActive
              ? "bg-game-accent hover:bg-game-primary cursor-pointer"
              : "bg-gray-500 cursor-not-allowed opacity-70"
          }
          ${isAnimating ? "animate-pulse-scale" : ""}
        `}
      >
        TAP!
      </Button>
      <div className="mt-8 text-4xl md:text-5xl font-bold text-white">
        {tapCount}
      </div>
      <p className="text-gray-300 mt-2">taps</p>
    </div>
  );
};

export default GameButton;
