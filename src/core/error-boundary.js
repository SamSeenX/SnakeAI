import { eventBus } from './event-bus.js'

export function initErrorBoundary() {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('[Runtime Error]:', { message, source, lineno, colno, error })
    eventBus.emit('toast:show', {
      message: 'System error intercepted. Refresh if stuck.',
      type: 'error'
    })
    return false
  }

  window.onunhandledrejection = (event) => {
    console.error('[Unhandled Promise Rejection]:', event.reason)
    eventBus.emit('toast:show', {
      message: 'Async operation failed gracefully.',
      type: 'error'
    })
  }
}
