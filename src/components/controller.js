import { eventBus } from '../core/event-bus.js'

export class ControllerComponent {
  constructor(container) {
    this.container = container
    this.activeTimeouts = new Map()
    this.render()
    this.bind()
  }

  render() {
    this.container.innerHTML = `
      <div id="controller">
        <div class="pad-status">CONTROLLER ACTIVE</div>
        <div class="dpad" role="group" aria-label="Virtual directional pad">
          <div></div>
          <button id="btn-up" class="dbtn" aria-label="Up">&#9650;</button>
          <div></div>
          <button id="btn-left" class="dbtn" aria-label="Left">&#9664;</button>
          <button id="btn-down" class="dbtn" aria-label="Down">&#9660;</button>
          <button id="btn-right" class="dbtn" aria-label="Right">&#9654;</button>
        </div>
      </div>
    `
    this.buttons = {
      UP: this.container.querySelector('#btn-up'),
      DOWN: this.container.querySelector('#btn-down'),
      LEFT: this.container.querySelector('#btn-left'),
      RIGHT: this.container.querySelector('#btn-right')
    }
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
