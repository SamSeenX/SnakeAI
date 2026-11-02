import { eventBus } from '../core/event-bus.js'

export class ControllerComponent {
  constructor() {
    this.activeTimeouts = new Map()
    this.buttons = {
      UP: document.getElementById('btn-up'),
      DOWN: document.getElementById('btn-down'),
      LEFT: document.getElementById('btn-left'),
      RIGHT: document.getElementById('btn-right')
    }
    this.bind()
  }

  bind() {
    this.unsubPress = eventBus.on('controller:press', (direction) => {
      this.simulatePress(direction)
    })
  }

  simulatePress(direction) {
    const btn = this.buttons[direction]
    if (!btn) return

    if (this.activeTimeouts.has(direction)) {
      clearTimeout(this.activeTimeouts.get(direction))
    }

    btn.classList.add('lit')
    const holdDuration = 120 + Math.floor(Math.random() * 120)

    const timer = setTimeout(() => {
      btn.classList.remove('lit')
      this.activeTimeouts.delete(direction)
    }, holdDuration)

    this.activeTimeouts.set(direction, timer)
  }

  destroy() {
    this.unsubPress?.()
    this.activeTimeouts.forEach((t) => clearTimeout(t))
    this.activeTimeouts.clear()
  }
}
