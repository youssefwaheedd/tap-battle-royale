# Tap Battle Royale

A real-time multiplayer tapping game where players compete to tap the fastest! Built with React, TypeScript, and Socket.IO.

## Features

- Real-time multiplayer gameplay
- Spacebar tapping support
- Ready-up system for fair game starts
- Live leaderboard
- Responsive design
- Beautiful animations
- Game countdown timer
- Auto-reset after game end

## Tech Stack

- **Frontend:**

  - React
  - TypeScript
  - Tailwind CSS
  - Framer Motion (animations)
  - Socket.IO Client

- **Backend:**
  - Node.js
  - Express
  - Socket.IO
  - JavaScript

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation 🚀

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tap-battle-royale.git
cd tap-battle-royale
```

2. Install dependencies:

```bash
# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
```

3. Start the development servers:

In one terminal (server):

```bash
cd server
npm run dev
```

In another terminal (client):

```bash
npm run dev
```

The game will be available at `http://localhost:8080`

## How to Play

1. Enter your name to join the game
2. Wait for another player to join
3. Click "Ready Up" when you're ready to play
4. When both players are ready, the game will start automatically
5. Press the spacebar as fast as you can during the game
6. The player with the most taps wins!

## Game Rules

- Each game lasts 15 seconds
- Players must ready up before the game starts
- The game requires at least 2 players
- Taps are registered using the spacebar
- The player with the most taps at the end wins
- In case of a tie, both players are declared winners

## Development

### Project Structure

```
tap-sprint-battle/
├── src/                 # Frontend source code
│   ├── components/     # React components
│   ├── services/       # Socket service and utilities
│   └── pages/         # Page components
├── server/             # Backend source code
│   └── server.js      # Socket.IO server
└── public/            # Static assets
```

