import { eventBus } from './event-bus.js'

function isDevNoise(errorOrMessage) {
  const str = String(errorOrMessage?.message || errorOrMessage || '').toLowerCase()
  return str.includes('websocket') || str.includes('vite') || str.includes('sockjs')
}

export function initErrorBoundary() {
  window.onerror = (message, source, lineno, colno, error) => {
    if (isDevNoise(message) || isDevNoise(error)) return false
    console.error('[Runtime Error]:', { message, source, lineno, colno, error })
    eventBus.emit('toast:show', {
      message: 'System error intercepted. Refresh if stuck.',
      type: 'error'
    })
    return false
  }

  window.onunhandledrejection = (event) => {
    if (isDevNoise(event?.reason)) return
    console.error('[Unhandled Promise Rejection]:', event.reason)
    eventBus.emit('toast:show', {
      message: 'Async operation failed gracefully.',
      type: 'error'
    })
  }
}
