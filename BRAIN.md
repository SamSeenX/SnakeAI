# Project Brain: Retro Snake 198X

## Architecture Philosophy
Retro Snake 198X is a zero-dependency, modular client-side web application built with modern Vanilla JavaScript ES6 modules, HTML5 Canvas, and custom CSS tokens.
The application emulates 1980s retro CRT arcade hardware aesthetics while running an autonomous artificial intelligence agent that navigates the snake grid.

## Core State & Event Topology
- **State Store (`src/core/store.js`)**: Manages reactive state fields including score, highScore, gridSize, gridIdx, and gameState with automatic localStorage synchronization.
- **Event Bus (`src/core/event-bus.js`)**: Decoupled pub/sub communication bus handling cross-module notifications without direct couplings.
- **AI Engine (`src/game/ai.js`)**: Breadth-First Search (BFS) pathfinding paired with flood-fill space counting and dynamic tail-buffer cushioning.
- **Game Engine (`src/game/engine.js`)**: High-precision interval tick orchestrator executing game steps, handling collisions, level increments, and directional signals.
- **Renderer (`src/game/renderer.js`)**: Direct HTML5 Canvas drawing pipeline rendering phosphor scanlines, radiant food orbs, and directional pixel eyes with glossy glints.

## Hard Constraints
- Strict file limit: Every source module remains strictly under 200 lines of code.
- Zero external runtime libraries: No React, no Tailwind, no third-party bundle bloat.
- Mobile ergonomics: All interactive touch targets meet the minimum 48px touch target standard.
- Cloudflare Pages ready: Production build compiles via Vite with console and debugger removal targeting ES2022.
