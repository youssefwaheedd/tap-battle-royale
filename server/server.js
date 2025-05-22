const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Game configuration
const GAME_DURATION = 15; // 15 seconds of gameplay
const COUNTDOWN_DURATION = 5; // 5 seconds countdown before game starts

// Create express app and http server
const app = express();
const server = http.createServer(app);

// Serve static files from the build directory in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

// Setup Socket.IO with CORS for development
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:8080", "http://127.0.0.1:8080"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Game state
let gameState = "waiting"; // waiting, countdown, playing, results
let players = {};
let countdownInterval;
let gameInterval;
let countdown = COUNTDOWN_DURATION;
let timeRemaining = GAME_DURATION;

// Emit current game state to all clients or a specific client
const emitGameState = (socket = null) => {
  const gameStateData = {
    state: gameState,
    players: Object.values(players),
    countdown: gameState === "countdown" ? countdown : null,
    timeRemaining: gameState === "playing" ? timeRemaining : null,
  };

  if (socket) {
    // Emit to specific client
    socket.emit("gameStateUpdate", gameStateData);
  } else {
    // Emit to all clients
    io.emit("gameStateUpdate", gameStateData);
  }
};

// Start game countdown
const startGameCountdown = () => {
  // Reset game state
  gameState = "countdown";
  countdown = COUNTDOWN_DURATION;

  // Reset player taps
  Object.keys(players).forEach((playerId) => {
    players[playerId].taps = 0;
  });

  emitGameState();

  // Start countdown
  countdownInterval = setInterval(() => {
    countdown--;
    emitGameState();

    if (countdown <= 0) {
      clearInterval(countdownInterval);
      startGame();
    }
  }, 1000);
};

// Start the actual gameplay
const startGame = () => {
  gameState = "playing";
  timeRemaining = GAME_DURATION;
  emitGameState();

  // Game timer countdown
  gameInterval = setInterval(() => {
    timeRemaining--;
    emitGameState();

    if (timeRemaining <= 0) {
      clearInterval(gameInterval);
      endGame();
    }
  }, 1000);
};

// End the game and show results
const endGame = () => {
  gameState = "results";
  emitGameState();

  // Auto reset game after 30 seconds
  setTimeout(() => {
    if (gameState === "results") {
      resetGame();
    }
  }, 30000);
};

// Reset the game to waiting state
const resetGame = () => {
  gameState = "waiting";

  // Reset player taps and ready status
  Object.keys(players).forEach((playerId) => {
    players[playerId].taps = 0;
    players[playerId].isReady = false;
  });

  emitGameState();
};

// Handle socket connections
io.on("connection", (socket) => {
  const playerName =
    socket.handshake.query.playerName || `Player ${socket.id.substr(0, 4)}`;

  players[socket.id] = {
    id: socket.id,
    name: playerName,
    taps: 0,
    isReady: false,
  };

  io.emit("playerJoined", players[socket.id]);
  emitGameState(socket);

  socket.on("playerReady", () => {
    if (players[socket.id]) {
      if (players[socket.id].isReady) {
        gameState = "waiting";

        Object.keys(players).forEach((playerId) => {
          players[playerId].isReady = false;
          players[playerId].taps = 0;
        });
      } else {
        players[socket.id].isReady = true;
      }

      emitGameState();

      const allPlayersReady = Object.values(players).every(
        (player) => player.isReady
      );
      if (allPlayersReady && Object.keys(players).length >= 2) {
        startGameCountdown();
      }
    }
  });

  socket.on("tap", () => {
    if (gameState === "playing" && players[socket.id]) {
      players[socket.id].taps++;
    }
  });

  socket.on("startGame", () => {
    if (gameState === "waiting") {
      startGameCountdown();
    }
  });

  socket.on("disconnect", () => {
    if (players[socket.id]) {
      delete players[socket.id];
    }

    if (Object.keys(players).length === 0) {
      clearInterval(countdownInterval);
      clearInterval(gameInterval);
      resetGame();
    } else {
      emitGameState();
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
