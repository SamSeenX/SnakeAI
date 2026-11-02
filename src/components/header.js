import { store } from '../core/store.js'
import { padScore, sanitize } from '../utils/sanitize.js'

export class HeaderComponent {
  constructor(container) {
    this.container = container
    this.render()
    this.bind()
  }

  render() {
    this.container.innerHTML = `
      <div id="game-title-header" class="text-glow-green">RETRO SNAKE 198X</div>
      <div id="top-bar">
        <div>SCORE:<br><span id="hud-score" style="color:var(--color-accent-gold);">00000</span></div>
        <div>BEST:<br><span id="hud-best" style="color:var(--color-phosphor);">00000</span></div>
        <div>GRID:<br><span id="hud-grid" style="color:var(--color-accent-cyan);">16x16</span></div>
      </div>
    `
    this.scoreEl = this.container.querySelector('#hud-score')
    this.bestEl = this.container.querySelector('#hud-best')
    this.gridEl = this.container.querySelector('#hud-grid')
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
