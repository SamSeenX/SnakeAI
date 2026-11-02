# Project Rules: Retro Snake 198X

## 1. Modular Architecture & 200-Line Limit
* Every JavaScript module (`.js`) and CSS stylesheet (`.css`) must strictly stay under 200 lines of code.
* When a module approaches 180 lines, proactively divide it into single-responsibility helpers or submodules.
* Project markdown documentation files are exempt from this limit.

## 2. Vanilla Philosophy & Zero Dependencies
* Write standard Vanilla JavaScript (ES6+ modules) and Vanilla CSS.
* No frontend frameworks (React, Vue, Svelte) and no utility CSS frameworks (Tailwind, UnoCSS).
* Vite is the sole dev server and build tool, targeting ES2022.

## 3. Storage & Error Resilience
* Wrap all localStorage read and write operations in safe try/catch handlers.
* Catch unhandled global errors and promise rejections with the error boundary component.

## 4. UI/UX & Touch Ergonomics
* All interactive touch controls must meet the minimum 48px target dimensions.
* Support safe-area insets for mobile screen notches and navigation bars.
* Maintain compact 1:1 square OpenGraph preview thumbnails between 100px and 299px under 300 KB.
