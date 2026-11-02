import { GRID_SIZES, CONSTANT_SPEED_MS, DIRECTIONS } from './constants.js'
import { computeNextMove } from './ai.js'
import { eventBus } from '../core/event-bus.js'
import { store } from '../core/store.js'

export class GameEngine {
  constructor(renderer) {
    this.renderer = renderer
    this.snake = []
    this.food = { x: 0, y: 0 }
    this.dir = { x: 1, y: 0 }
    this.lastDir = { x: 1, y: 0 }
    this.gameInterval = null
    this.isRunning = false

    this.bindEvents()
  }

  bindEvents() {
    eventBus.on('game:start', (resetGrid) => this.start(resetGrid))
    eventBus.on('game:stop', () => this.stop())
  }

  init(resetGrid = true) {
    if (resetGrid) {
      store.set('gridIdx', 0)
    }
    const gridIdx = store.get('gridIdx')
    const size = GRID_SIZES[gridIdx]
    store.set('gridSize', size)
    store.set('score', 0)

    const startX = Math.floor(size / 2)
    const startY = Math.floor(size / 2)
    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ]

    this.dir = { x: 1, y: 0 }
    this.lastDir = { x: 1, y: 0 }

    this.spawnFood()
    this.render()
  }

  spawnFood() {
    const size = store.get('gridSize')
    const emptyCells = []

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const occupied = this.snake.some((s) => s.x === c && s.y === r)
        if (!occupied) emptyCells.push({ x: c, y: r })
      }
    }

    if (emptyCells.length <= 2) {
      this.levelUp()
      return
    }

    const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    this.food = { x: choice.x, y: choice.y }
  }

  step() {
    const size = store.get('gridSize')
    const nextDirName = computeNextMove(this.snake, this.food, this.dir, size, size)
    const nextDir = DIRECTIONS[nextDirName]

    if (nextDir.x !== this.lastDir.x || nextDir.y !== this.lastDir.y) {
      eventBus.emit('controller:press', nextDirName)
    }

    this.dir = { x: nextDir.x, y: nextDir.y }
    this.lastDir = { x: nextDir.x, y: nextDir.y }

    const newHead = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y }

    // Wall collision
    if (newHead.x < 0 || newHead.x >= size || newHead.y < 0 || newHead.y >= size) {
      this.gameOver()
      return
    }

    // Self collision
    const willEat = (newHead.x === this.food.x && newHead.y === this.food.y)
    const deathBoundary = willEat ? this.snake.length : this.snake.length - 1
    for (let s = 0; s < deathBoundary; s++) {
      if (this.snake[s].x === newHead.x && this.snake[s].y === newHead.y) {
        this.gameOver()
        return
      }
    }

    this.snake.unshift(newHead)

    if (willEat) {
      const newScore = store.get('score') + 10
      store.set('score', newScore)
      if (newScore > store.get('highScore')) {
        store.set('highScore', newScore)
      }
      this.spawnFood()
    } else {
      this.snake.pop()
    }

    this.render()
  }

  levelUp() {
    this.stop()
    const currentIdx = store.get('gridIdx')
    if (currentIdx < GRID_SIZES.length - 1) {
      store.set('gridIdx', currentIdx + 1)
    }
    eventBus.emit('game:levelup')
  }

  gameOver() {
    this.stop()
    eventBus.emit('game:gameover')
  }

  start(resetGrid = true) {
    this.stop()
    this.init(resetGrid)
    this.isRunning = true
    this.gameInterval = setInterval(() => this.step(), CONSTANT_SPEED_MS)
    store.set('gameState', 'running')
  }

  stop() {
    this.isRunning = false
    if (this.gameInterval) {
      clearInterval(this.gameInterval)
      this.gameInterval = null
    }
  }

  render() {
    const size = store.get('gridSize')
    this.renderer.draw(this.snake, this.food, this.dir, size, size)
  }
}
