import { eventBus } from '../core/event-bus.js'

export class OverlayComponent {
  constructor() {
    this.overlayEl = document.getElementById('overlay')
    this.titleEl = document.getElementById('overlay-title')
    this.startBtn = document.getElementById('start-btn')
    this.countdownTimer = null
    this.bind()
  }

  bind() {
    const handleStart = (e) => {
      e.preventDefault()
      this.clearCountdown()
      this.hide()
      const isLevelUp = this.mode === 'levelup'
      eventBus.emit('game:start', !isLevelUp)
    }

    this.startBtn?.addEventListener('click', handleStart)
    this.startBtn?.addEventListener('touchstart', handleStart, { passive: false })

    this.unsubGameOver = eventBus.on('game:gameover', () => this.showGameOver())
    this.unsubLevelUp = eventBus.on('game:levelup', () => this.showLevelUp())
  }

  clearCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    }
  }

  showGameOver() {
    this.mode = 'gameover'
    if (this.titleEl) {
      this.titleEl.textContent = 'GAME OVER'
      this.titleEl.style.color = 'var(--color-accent-pink)'
      this.titleEl.style.textShadow = '0 0 10px var(--color-accent-pink)'
    }
    this.startCountdown('RETRY', true)
  }

  showLevelUp() {
    this.mode = 'levelup'
    if (this.titleEl) {
      this.titleEl.textContent = 'ZONE CONQUERED!'
      this.titleEl.style.color = 'var(--color-accent-gold)'
      this.titleEl.style.textShadow = '0 0 10px var(--color-accent-gold)'
    }
    this.startCountdown('NEXT LEVEL', false)
  }

  startCountdown(label, resetGrid) {
    this.clearCountdown()
    this.show()
    let count = 2
    if (this.startBtn) this.startBtn.textContent = `${label} [ ${count} ]`

    this.countdownTimer = setInterval(() => {
      count--
      if (count > 0) {
        if (this.startBtn) this.startBtn.textContent = `${label} [ ${count} ]`
      } else {
        this.clearCountdown()
        this.startBtn?.classList.add('active')
        setTimeout(() => {
          this.startBtn?.classList.remove('active')
          this.hide()
          eventBus.emit('game:start', resetGrid)
        }, 200)
      }
    }, 1000)
  }

  show() {
    if (this.overlayEl) this.overlayEl.style.display = 'flex'
  }

  hide() {
    if (this.overlayEl) this.overlayEl.style.display = 'none'
  }

  destroy() {
    this.clearCountdown()
    this.unsubGameOver?.()
    this.unsubLevelUp?.()
  }
}
