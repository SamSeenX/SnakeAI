import { initErrorBoundary } from './core/error-boundary.js'
import { storage } from './utils/storage.js'
import { HeaderComponent } from './components/header.js'
import { ControllerComponent } from './components/controller.js'
import { OverlayComponent } from './components/overlay.js'
import { ToastComponent } from './components/toast.js'
import { GameRenderer } from './game/renderer.js'
import { GameEngine } from './game/engine.js'
import { CANVAS_SIZE } from './game/constants.js'

function bootstrap() {
  initErrorBoundary()
  storage.requestPersistence()

  const app = document.getElementById('app')
  if (!app) return

  // Header
  const headerContainer = document.createElement('div')
  headerContainer.style.width = '100%'
  app.appendChild(headerContainer)
  new HeaderComponent(headerContainer)

  // Game box (canvas + CRT overlay + menu overlay)
  const gameBox = document.createElement('div')
  gameBox.id = 'game-box'
  gameBox.innerHTML = `
    <canvas id="canvas" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}"></canvas>
    <div class="crt-overlay"></div>
  `
  app.appendChild(gameBox)

  const canvas = gameBox.querySelector('#canvas')
  const renderer = new GameRenderer(canvas)
  const engine = new GameEngine(renderer)

  // Overlay mounted inside gameBox
  new OverlayComponent(gameBox)

  // Virtual Controller
  const controllerContainer = document.createElement('div')
  controllerContainer.style.width = '100%'
  app.appendChild(controllerContainer)
  new ControllerComponent(controllerContainer)

  // Toasts
  new ToastComponent(document.body)

  // Initial draw
  engine.init(true)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap)
} else {
  bootstrap()
}
