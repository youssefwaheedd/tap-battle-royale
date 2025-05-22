import { io, Socket } from "socket.io-client";

type GameState = "waiting" | "countdown" | "playing" | "results";

export interface Player {
  id: string;
  name: string;
  taps: number;
  isReady: boolean;
}

export interface GameStateUpdate {
  state: GameState;
  countdown?: number;
  timeRemaining?: number;
  players: Player[];
}

class SocketService {
  private socket: Socket | null = null;
  private callbacks: {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onGameStateUpdate?: (state: GameStateUpdate) => void;
    onPlayerJoined?: (player: Player) => void;
    onError?: (error: string) => void;
  } = {};

  connect(playerName: string): void {
    // In a real deployment, this would point to your production server
    const serverUrl = import.meta.env.DEV
      ? "http://localhost:3001"
      : window.location.origin;

    this.socket = io(serverUrl, {
      query: { playerName },
    });

    this.socket.on("connect", () => {
      if (this.callbacks.onConnect) this.callbacks.onConnect();
    });

    this.socket.on("disconnect", () => {
      if (this.callbacks.onDisconnect) this.callbacks.onDisconnect();
    });

    this.socket.on("gameStateUpdate", (data: GameStateUpdate) => {
      if (this.callbacks.onGameStateUpdate)
        this.callbacks.onGameStateUpdate(data);
    });

    this.socket.on("playerJoined", (player: Player) => {
      if (this.callbacks.onPlayerJoined) this.callbacks.onPlayerJoined(player);
    });

    this.socket.on("error", (error: string) => {
      if (this.callbacks.onError) this.callbacks.onError(error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  registerTap(): void {
    if (this.socket) {
      this.socket.emit("tap");
    }
  }

  startGame(): void {
    if (this.socket) {
      this.socket.emit("startGame");
    }
  }

  setPlayerReady(): void {
    if (this.socket) {
      this.socket.emit("playerReady");
    }
  }

  onConnect(callback: () => void): void {
    this.callbacks.onConnect = callback;
  }

  onDisconnect(callback: () => void): void {
    this.callbacks.onDisconnect = callback;
  }

  onGameStateUpdate(callback: (state: GameStateUpdate) => void): void {
    this.callbacks.onGameStateUpdate = callback;
  }

  onPlayerJoined(callback: (player: Player) => void): void {
    this.callbacks.onPlayerJoined = callback;
  }

  onError(callback: (error: string) => void): void {
    this.callbacks.onError = callback;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Singleton instance
export const socketService = new SocketService();
