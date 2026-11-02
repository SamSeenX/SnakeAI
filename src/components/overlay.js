import { eventBus } from '../core/event-bus.js'

export class OverlayComponent {
  constructor(container) {
    this.container = container
    this.countdownTimer = null
    this.render()
    this.bind()
  }

  render() {
    this.container.innerHTML = `
      <div id="overlay" class="overlay">
        <div id="overlay-title" class="title">NEON COBRA</div>
        <button id="start-btn" class="btn">PRESS START</button>
      </div>
    `
    this.overlayEl = this.container.querySelector('#overlay')
    this.titleEl = this.container.querySelector('#overlay-title')
    this.startBtn = this.container.querySelector('#start-btn')
  }

  bind() {
    const handleStart = (e) => {
      e.preventDefault()
      this.clearCountdown()
      this.hide()
      const isLevelUp = this.mode === 'levelup'
      eventBus.emit('game:start', !isLevelUp)
    }

    this.startBtn.addEventListener('click', handleStart)
    this.startBtn.addEventListener('touchstart', handleStart, { passive: false })

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
    this.titleEl.textContent = 'GAME OVER'
    this.titleEl.style.color = 'var(--color-accent-pink)'
    this.titleEl.style.textShadow = '0 0 10px var(--color-accent-pink)'
    this.startCountdown('RETRY', true)
  }

  showLevelUp() {
    this.mode = 'levelup'
    this.titleEl.textContent = 'ZONE CONQUERED!'
    this.titleEl.style.color = 'var(--color-accent-gold)'
    this.titleEl.style.textShadow = '0 0 10px var(--color-accent-gold)'
    this.startCountdown('NEXT LEVEL', false)
  }

  startCountdown(label, resetGrid) {
    this.clearCountdown()
    this.show()
    let count = 2
    this.startBtn.textContent = `${label} [ ${count} ]`

    this.countdownTimer = setInterval(() => {
      count--
      if (count > 0) {
        this.startBtn.textContent = `${label} [ ${count} ]`
      } else {
        this.clearCountdown()
        this.startBtn.classList.add('active')
        setTimeout(() => {
          this.startBtn.classList.remove('active')
          this.hide()
          eventBus.emit('game:start', resetGrid)
        }, 200)
      }
    }, 1000)
  }

  show() {
    this.overlayEl.classList.remove('hidden')
  }

  hide() {
    this.overlayEl.classList.add('hidden')
  }

  destroy() {
    this.clearCountdown()
    this.unsubGameOver?.()
    this.unsubLevelUp?.()
  }
}
