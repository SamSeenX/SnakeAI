import { initErrorBoundary } from './core/error-boundary.js'
import { storage } from './utils/storage.js'
import { HeaderComponent } from './components/header.js'
import { ControllerComponent } from './components/controller.js'
import { OverlayComponent } from './components/overlay.js'
import { ToastComponent } from './components/toast.js'
import { GameRenderer } from './game/renderer.js'
import { GameEngine } from './game/engine.js'

function bootstrap() {
  initErrorBoundary()
  storage.requestPersistence()

  new HeaderComponent()
  new ControllerComponent()
  new OverlayComponent()
  new ToastComponent(document.body)

  const canvas = document.getElementById('canvas')
  const renderer = new GameRenderer(canvas)
  const engine = new GameEngine(renderer)

  // Initial render of snake and board
  engine.init(true)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap)
} else {
  bootstrap()
}
