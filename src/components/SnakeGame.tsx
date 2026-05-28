import { useEffect, useRef } from 'react'
import { playBeep, playGameOver } from '../lib/audio'

const COLS = 20
const ROWS = 13
const CELL = 14
const W = COLS * CELL  // 280
const H = ROWS * CELL  // 182

const LCD_BG = '#c2cf9c'
const LCD_DARK = '#1d2b00'
const LCD_MID = '#8fa370'

type Dir = 'U' | 'D' | 'L' | 'R'
type Pt = { x: number; y: number }

interface Props {
  keySignal: { key: string; seq: number } | null
  onExit: () => void
}

function newGame() {
  const snake: Pt[] = [{ x: 10, y: 6 }, { x: 9, y: 6 }, { x: 8, y: 6 }]
  return {
    snake,
    dir: 'R' as Dir,
    nextDir: 'R' as Dir,
    food: randomFood(snake),
    score: 0,
    dead: false,
  }
}

function randomFood(snake: Pt[]): Pt {
  let pt: Pt
  do {
    pt = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
  } while (snake.some(s => s.x === pt.x && s.y === pt.y))
  return pt
}

export default function SnakeGame({ keySignal, onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef(newGame())
  const lastKeySeq = useRef(-1)
  const rafRef = useRef(0)
  const lastTickRef = useRef(0)

  function speed(score: number) {
    return Math.max(100, 300 - score * 12)
  }

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const { snake, food, score, dead } = stateRef.current

    ctx.fillStyle = LCD_BG
    ctx.fillRect(0, 0, W, H)

    // Grid dots
    ctx.fillStyle = LCD_MID
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2)
      }
    }

    // Food
    ctx.fillStyle = LCD_DARK
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4)

    // Snake
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? LCD_DARK : '#3a5a20'
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
    })

    // Score
    ctx.fillStyle = LCD_DARK
    ctx.font = '10px monospace'
    ctx.fillText(`${score}`, 4, 12)

    if (dead) {
      ctx.fillStyle = 'rgba(29,43,0,0.55)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = LCD_BG
      ctx.font = 'bold 14px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', W / 2, H / 2 - 8)
      ctx.font = '10px monospace'
      ctx.fillText(`SCORE: ${score}`, W / 2, H / 2 + 8)
      ctx.fillText('5=RESTART  *=EXIT', W / 2, H / 2 + 22)
      ctx.textAlign = 'left'
    }
  }

  function tick(ts: number) {
    const state = stateRef.current
    if (!state.dead) {
      if (ts - lastTickRef.current >= speed(state.score)) {
        lastTickRef.current = ts
        state.dir = state.nextDir

        const head = state.snake[0]
        const next = {
          x: (head.x + (state.dir === 'R' ? 1 : state.dir === 'L' ? -1 : 0) + COLS) % COLS,
          y: (head.y + (state.dir === 'D' ? 1 : state.dir === 'U' ? -1 : 0) + ROWS) % ROWS,
        }

        if (state.snake.some(s => s.x === next.x && s.y === next.y)) {
          state.dead = true
          playGameOver()
        } else {
          state.snake.unshift(next)
          if (next.x === state.food.x && next.y === state.food.y) {
            state.score++
            state.food = randomFood(state.snake)
            playBeep(880, 0.06, 0.15)
          } else {
            state.snake.pop()
          }
        }
      }
    }
    draw()
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    stateRef.current = newGame()
    lastTickRef.current = 0
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    if (!keySignal || keySignal.seq === lastKeySeq.current) return
    lastKeySeq.current = keySignal.seq
    const { key } = keySignal
    const state = stateRef.current

    if (state.dead) {
      if (key === '5') { stateRef.current = newGame(); lastTickRef.current = 0 }
      if (key === '*') onExit()
      return
    }

    const DIR_MAP: Record<string, Dir> = {
      U: 'U', D: 'D', L: 'L', R: 'R',
      '2': 'U', '8': 'D', '4': 'L', '6': 'R',
    }
    const opposites: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' }
    const nd = DIR_MAP[key]
    if (nd && nd !== opposites[state.dir]) state.nextDir = nd
    if (key === '*') onExit()
  }, [keySignal])

  return (
    <div style={{ background: LCD_BG, padding: 4 }}>
      <div
        className="text-xs tracking-widest px-1 pb-1"
        style={{ color: LCD_DARK, fontFamily: 'inherit' }}
      >
        ◄ SNAKE  2/4/6/8=DIR  *=EXIT
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: 'block', imageRendering: 'pixelated' }}
      />
    </div>
  )
}
