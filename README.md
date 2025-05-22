
# Tap Battle Royale - Real-time Multiplayer Button Tapping Game

A real-time multiplayer game where players compete to tap a button as many times as possible within 15 seconds.

## Project info

**URL**: https://lovable.dev/projects/7e3cf0f2-1d6c-4dca-853d-61423151d967

## Features

- Real-time multiplayer gameplay using WebSockets (Socket.IO)
- Synchronized game start across all players
- Countdown timer before the game begins
- 15-second gameplay duration
- Live leaderboard updates
- End-game results showing all players' performances

## How to Run Locally

### Running the Client

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Running the WebSocket Server

```sh
# Step 1: Navigate to the server directory
cd server

# Step 2: Install server dependencies
npm install

# Step 3: Start the server
npm run dev
```

The game client will run on `http://localhost:8080` and the WebSocket server will run on `http://localhost:3001`.

## How to Play

1. Open the game in your browser
2. Enter your name and join the game
3. The first player to join becomes the host and can start the game
4. When the game starts, a 5-second countdown begins
5. After the countdown, rapidly tap any key on your keyboard or click/tap the button
6. Keep tapping until the 15-second time limit is reached
7. View the results to see who won!

## Technologies Used

- Vite + React + TypeScript for the frontend
- Socket.IO for real-time WebSocket communication
- Express for the backend server
- Tailwind CSS for styling
- Framer Motion for animations

## Deployment

For deployment, you'll need to:

1. Build the client: `npm run build`
2. Set up the server to serve the static files from the build directory
3. Deploy both the client and server to a hosting provider that supports WebSockets

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7e3cf0f2-1d6c-4dca-853d-61423151d967) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
