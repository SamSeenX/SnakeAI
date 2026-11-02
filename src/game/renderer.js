export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  draw(snake, food, dir, cols, rows) {
    const { ctx, canvas } = this
    const cellW = canvas.width / cols
    const cellH = canvas.height / rows

    ctx.fillStyle = '#020902'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    this.drawGrid(cols, rows, cellW, cellH)
    this.drawFood(food, cellW, cellH)
    this.drawSnake(snake, dir, cellW, cellH)
  }

  drawGrid(cols, rows, cellW, cellH) {
    const { ctx, canvas } = this
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.04)'
    ctx.lineWidth = 1

    for (let gx = 0; gx <= cols; gx++) {
      ctx.beginPath()
      ctx.moveTo(gx * cellW, 0)
      ctx.lineTo(gx * cellW, canvas.height)
      ctx.stroke()
    }
    for (let gy = 0; gy <= rows; gy++) {
      ctx.beginPath()
      ctx.moveTo(0, gy * cellH)
      ctx.lineTo(canvas.width, gy * cellH)
      ctx.stroke()
    }
  }

  drawFood(food, cellW, cellH) {
    const { ctx } = this
    const fx = food.x * cellW + cellW / 2
    const fy = food.y * cellH + cellH / 2
    const rad = cellW * 0.38

    ctx.save()
    ctx.shadowColor = '#ff1155'
    ctx.shadowBlur = 12
    ctx.fillStyle = '#ff1155'
    ctx.beginPath()
    ctx.arc(fx, fy, rad, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ff99bb'
    ctx.beginPath()
    ctx.arc(fx - rad * 0.28, fy - rad * 0.28, rad * 0.32, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  drawSnake(snake, dir, cellW, cellH) {
    const { ctx } = this

    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i]
      const sx = seg.x * cellW
      const sy = seg.y * cellH

      if (i === 0) {
        this.drawHead(sx, sy, cellW, cellH, dir)
      } else {
        const alpha = 1 - (i / snake.length) * 0.35
        ctx.fillStyle = `rgba(0, 255, 102, ${alpha})`
        ctx.fillRect(sx + 1, sy + 1, cellW - 2, cellH - 2)

        ctx.fillStyle = 'rgba(150, 255, 190, 0.25)'
        ctx.fillRect(sx + 2, sy + 2, cellW - 4, 2)
      }
    }
  }

  drawHead(sx, sy, cellW, cellH, dir) {
    const { ctx } = this
    ctx.save()
    ctx.shadowColor = '#00f0ff'
    ctx.shadowBlur = 10
    ctx.fillStyle = '#00e1ff'
    ctx.fillRect(sx + 1, sy + 1, cellW - 2, cellH - 2)

    ctx.strokeStyle = '#a6f8ff'
    ctx.lineWidth = 1
    ctx.strokeRect(sx + 2, sy + 2, cellW - 4, cellH - 4)
    ctx.restore()

    this.drawEyes(sx, sy, cellW, cellH, dir)
  }

  drawEyes(sx, sy, cellW, cellH, dir) {
    const { ctx } = this
    const eyeSize = Math.max(3, Math.floor(cellW * 0.22))
    const pupilSize = Math.max(2, Math.floor(eyeSize * 0.55))

    const eyeY = sy + Math.floor(cellH * 0.26)
    const e1x = sx + Math.floor(cellW * 0.22)
    const e2x = sx + Math.floor(cellW * 0.58)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(e1x, eyeY, eyeSize, eyeSize)
    ctx.fillRect(e2x, eyeY, eyeSize, eyeSize)

    ctx.fillStyle = '#000000'
    let pxOff = Math.floor((eyeSize - pupilSize) / 2)
    let pyOff = Math.floor((eyeSize - pupilSize) / 2)

    if (dir.x === 1) pxOff = Math.min(eyeSize - pupilSize, pxOff + 1)
    else if (dir.x === -1) pxOff = Math.max(0, pxOff - 1)
    if (dir.y === -1) pyOff = Math.max(0, pyOff - 1)
    else if (dir.y === 1) pyOff = Math.min(eyeSize - pupilSize, pyOff + 1)

    ctx.fillRect(e1x + pxOff, eyeY + pyOff, pupilSize, pupilSize)
    ctx.fillRect(e2x + pxOff, eyeY + pyOff, pupilSize, pupilSize)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(e1x + 1, eyeY + 1, 1, 1)
    ctx.fillRect(e2x + 1, eyeY + 1, 1, 1)
  }
}
