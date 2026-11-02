import { storage } from '../utils/storage.js'
import { eventBus } from './event-bus.js'

class Store {
  constructor(initialState = {}) {
    this.state = {
      score: 0,
      highScore: storage.get('retro_hi_score', 0),
      gridSize: 16,
      gridIdx: 0,
      gameState: 'idle',
      ...initialState
    }
    this.subscribers = new Map()
  }

  get(key) {
    return this.state[key]
  }

  set(key, value) {
    if (this.state[key] === value) return
    this.state[key] = value

    if (key === 'highScore') {
      storage.set('retro_hi_score', value)
    }

    const callbacks = this.subscribers.get(key)
    if (callbacks) {
      callbacks.forEach((fn) => fn(value))
    }
    eventBus.emit(`state:${key}`, value)
  }

  update(patch) {
    Object.entries(patch).forEach(([key, val]) => {
      this.set(key, val)
    })
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    this.subscribers.get(key).add(callback)
    callback(this.state[key])
    return () => this.subscribers.get(key)?.delete(callback)
  }
}

export const store = new Store()
