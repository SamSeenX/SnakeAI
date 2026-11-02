import { eventBus } from '../core/event-bus.js'
import { sanitize } from '../utils/sanitize.js'

export class ToastComponent {
  constructor(container) {
    this.container = container
    this.render()
    this.bind()
  }

  render() {
    this.toastWrapper = document.createElement('div')
    this.toastWrapper.className = 'toast-container'
    this.toastWrapper.setAttribute('role', 'status')
    this.toastWrapper.setAttribute('aria-live', 'polite')
    this.container.appendChild(this.toastWrapper)
  }

  bind() {
    this.unsubToast = eventBus.on('toast:show', ({ message }) => {
      this.showToast(message)
    })
  }

  showToast(message) {
    const toast = document.createElement('div')
    toast.className = 'toast'
    toast.textContent = sanitize(message)
    this.toastWrapper.appendChild(toast)

    requestAnimationFrame(() => {
      toast.classList.add('show')
    })

    setTimeout(() => {
      toast.classList.remove('show')
      setTimeout(() => toast.remove(), 250)
    }, 3000)
  }

  destroy() {
    this.unsubToast?.()
    this.toastWrapper.remove()
  }
}
