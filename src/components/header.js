import { store } from '../core/store.js'
import { padScore, sanitize } from '../utils/sanitize.js'

export class HeaderComponent {
  constructor() {
    this.scoreEl = document.getElementById('hud-score')
    this.bestEl = document.getElementById('hud-best')
    this.gridEl = document.getElementById('hud-grid')
    this.bind()
  }

  bind() {
    this.unsubScore = store.subscribe('score', (val) => {
      if (this.scoreEl) this.scoreEl.textContent = sanitize(padScore(val))
    })

    this.unsubBest = store.subscribe('highScore', (val) => {
      if (this.bestEl) this.bestEl.textContent = sanitize(padScore(val))
    })

    this.unsubGrid = store.subscribe('gridSize', (val) => {
      if (this.gridEl) this.gridEl.textContent = `${sanitize(String(val))}x${sanitize(String(val))}`
    })
  }

  destroy() {
    this.unsubScore?.()
    this.unsubBest?.()
    this.unsubGrid?.()
  }
}
