# Retro Snake 198X

An autonomous AI-driven retro snake game inspired by 1980s CRT arcade hardware. Built with pure Vanilla JavaScript (ES6+ modules), modern CSS, and HTML5 Canvas.

## Features
* **Autonomous AI Engine**: Breadth-First Search (BFS) pathfinding coupled with flood-fill space validation and dynamic tail cushion buffers.
* **Retro Arcade CRT Aesthetics**: Scanlines raster overlays, phosphor green grids, glowing pink food orbs, and animated cyan snake with directional pixel eyes.
* **Interactive D-Pad Simulation**: Virtual 48px touch-target directional pad with animated lit button states reflecting real-time AI steering decisions.
* **Tiered Progression**: Dynamic grid expansion across 5 retro levels (16x16 up to 32x32) with automatic countdown overlays.
* **Persistent Scoring**: High-score tracking stored locally with quota recovery and persistent storage requests.

## Getting Started

### Development
```bash
npx vite
```

### Production Build
```bash
npx vite build
```

## Architecture
Zero external runtime dependencies. Every JavaScript module and CSS stylesheet strictly adheres to the 200-line modular design standard.
