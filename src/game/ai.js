import { DIRECTIONS } from './constants.js'

function bfs(start, goal, obstacles, cols, rows) {
  const queue = [{ x: start.x, y: start.y, path: [] }]
  const visited = new Set([`${start.x},${start.y}`])

  for (let i = 0; i < obstacles.length; i++) {
    visited.add(`${obstacles[i].x},${obstacles[i].y}`)
  }

  while (queue.length > 0) {
    const cur = queue.shift()
    if (cur.x === goal.x && cur.y === goal.y) {
      return cur.path
    }

    const neighbors = [
      { x: cur.x + 1, y: cur.y, d: 'RIGHT' },
      { x: cur.x - 1, y: cur.y, d: 'LEFT' },
      { x: cur.x, y: cur.y + 1, d: 'DOWN' },
      { x: cur.x, y: cur.y - 1, d: 'UP' }
    ]

    for (let n = 0; n < neighbors.length; n++) {
      const nb = neighbors[n]
      const key = `${nb.x},${nb.y}`
      if (nb.x >= 0 && nb.x < cols && nb.y >= 0 && nb.y < rows && !visited.has(key)) {
        visited.add(key)
        queue.push({ x: nb.x, y: nb.y, path: [...cur.path, nb.d] })
      }
    }
  }
  return null
}

function floodCount(start, obstacles, cols, rows) {
  let count = 0
  const queue = [start]
  const visited = new Set([`${start.x},${start.y}`])
  for (let i = 0; i < obstacles.length; i++) {
    visited.add(`${obstacles[i].x},${obstacles[i].y}`)
  }

  while (queue.length > 0) {
    const cur = queue.shift()
    count++
    const nbs = [
      { x: cur.x + 1, y: cur.y },
      { x: cur.x - 1, y: cur.y },
      { x: cur.x, y: cur.y + 1 },
      { x: cur.x, y: cur.y - 1 }
    ]
    for (let j = 0; j < nbs.length; j++) {
      const p = nbs[j]
      const k = `${p.x},${p.y}`
      if (p.x >= 0 && p.x < cols && p.y >= 0 && p.y < rows && !visited.has(k)) {
        visited.add(k)
        queue.push(p)
      }
    }
  }
  return count
}

export function computeNextMove(snake, food, currentDir, cols, rows) {
  const head = snake[0]
  const nextTickObstacles = snake.slice(0, snake.length - 1)
  const tail = snake[snake.length - 1]

  const bufferSegments = Math.min(2, Math.max(0, snake.length - 4))
  const phantomObstacles = bufferSegments > 0 ? snake.slice(0, snake.length) : nextTickObstacles

  const pathToFood = bfs(head, food, phantomObstacles, cols, rows) ||
                     bfs(head, food, nextTickObstacles, cols, rows)

  if (pathToFood && pathToFood.length > 0) {
    const simSnake = snake.map((s) => ({ ...s }))
    for (let step = 0; step < pathToFood.length; step++) {
      const dName = pathToFood[step]
      const dirOffset = DIRECTIONS[dName]
      const nHead = { x: simSnake[0].x + dirOffset.x, y: simSnake[0].y + dirOffset.y }
      simSnake.unshift(nHead)

      const eats = (nHead.x === food.x && nHead.y === food.y)
      if (!eats) {
        simSnake.pop()
      }
    }

    const simHead = simSnake[0]
    const targetTailIdx = Math.max(0, simSnake.length - 1 - bufferSegments)
    const simTargetTail = simSnake[targetTailIdx]
    const simObstacles = simSnake.slice(0, simSnake.length - 1)
    const escapeToTail = bfs(simHead, simTargetTail, simObstacles, cols, rows) ||
                         bfs(simHead, simSnake[simSnake.length - 1], simObstacles, cols, rows)
    const room = floodCount(simHead, simObstacles, cols, rows)

    if (escapeToTail || room >= Math.max(8, Math.floor(snake.length * 0.4))) {
      return pathToFood[0]
    }
  }

  const validMoves = Object.values(DIRECTIONS)
  let bestMove = null
  let maxSpace = -1

  for (let m = 0; m < validMoves.length; m++) {
    const vm = validMoves[m]
    if (vm.x === -currentDir.x && vm.y === -currentDir.y) continue

    const nextPos = { x: head.x + vm.x, y: head.y + vm.y }
    if (nextPos.x < 0 || nextPos.x >= cols || nextPos.y < 0 || nextPos.y >= rows) continue

    const willEat = (nextPos.x === food.x && nextPos.y === food.y)
    const collisionLimit = willEat ? snake.length : snake.length - 1
    let collision = false
    for (let b = 0; b < collisionLimit; b++) {
      if (snake[b].x === nextPos.x && snake[b].y === nextPos.y) {
        collision = true
        break
      }
    }
    if (collision) continue

    const openTiles = floodCount(nextPos, nextTickObstacles, cols, rows)
    const canSeeTail = bfs(nextPos, tail, nextTickObstacles, cols, rows) ? 50 : 0
    const distToTail = Math.abs(nextPos.x - tail.x) + Math.abs(nextPos.y - tail.y)
    let tailBufferBonus = (distToTail >= 2 && distToTail <= 5) ? 25 : 0
    if (distToTail <= 1 && openTiles > 10) {
      tailBufferBonus -= 20
    }

    const scoreWeight = openTiles + canSeeTail + tailBufferBonus
    if (scoreWeight > maxSpace) {
      maxSpace = scoreWeight
      bestMove = vm.name
    }
  }

  return bestMove || 'RIGHT'
}
