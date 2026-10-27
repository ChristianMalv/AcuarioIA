'use client'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent,
} from 'react'
import { Paintbrush, Droplets, RotateCcw, Download, Save } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { saveArtwork } from '@/lib/kids-gallery'

type Tool = 'lanzar' | 'brocha'

type Projectile = {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
}

const COLORS = [
  { name: 'Rojo', hex: '#E53935' },
  { name: 'Naranja', hex: '#F57C00' },
  { name: 'Amarillo', hex: '#FDD835' },
  { name: 'Verde', hex: '#43A047' },
  { name: 'Azul', hex: '#1E88E5' },
  { name: 'Acuario', hex: '#0073E6' },
  { name: 'Morado', hex: '#8E24AA' },
  { name: 'Rosa', hex: '#EC407A' },
  { name: 'Café', hex: '#795548' },
  { name: 'Negro', hex: '#212121' },
]

const GRAVITY = 0.45
const POWER = 0.24

export type PaintCanvasGameHandle = {
  loadImage: (dataUrl: string) => void
}

function drawSplat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  size: number,
  vx: number,
  vy: number
) {
  const speed = Math.hypot(vx, vy)
  const r = Math.min(size * (1.3 + speed * 0.14), size * 3.4)

  // Mancha principal irregular
  const pts = 14
  const points: Array<{ px: number; py: number }> = []
  for (let i = 0; i < pts; i++) {
    const angle = (i / pts) * Math.PI * 2
    const rr = r * (0.6 + Math.random() * 0.65)
    points.push({ px: x + Math.cos(angle) * rr, py: y + Math.sin(angle) * rr })
  }
  ctx.beginPath()
  const firstMid = {
    px: (points[pts - 1].px + points[0].px) / 2,
    py: (points[pts - 1].py + points[0].py) / 2,
  }
  ctx.moveTo(firstMid.px, firstMid.py)
  for (let i = 0; i < pts; i++) {
    const p = points[i]
    const next = points[(i + 1) % pts]
    ctx.quadraticCurveTo(p.px, p.py, (p.px + next.px) / 2, (p.py + next.py) / 2)
  }
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()

  // Gotas salpicadas
  const droplets = 8 + Math.min(22, Math.floor(speed * 1.6))
  for (let i = 0; i < droplets; i++) {
    const angle = Math.random() * Math.PI * 2
    const dist = r * (0.9 + Math.random() * 2)
    const dr = 1.5 + Math.random() * r * 0.28
    ctx.beginPath()
    ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, dr, 0, Math.PI * 2)
    ctx.fill()
  }

  // Chorreaduras ocasionales hacia abajo
  if (Math.random() < 0.65) {
    const drips = 1 + Math.floor(Math.random() * 3)
    for (let i = 0; i < drips; i++) {
      const dx = (Math.random() - 0.5) * r * 1.4
      const len = r * (0.4 + Math.random() * 1.1)
      const w = 2 + Math.random() * 3
      ctx.beginPath()
      ctx.moveTo(x + dx - w / 2, y)
      ctx.lineTo(x + dx + w / 2, y)
      ctx.lineTo(x + dx + w / 4, y + len)
      ctx.arc(x + dx, y + len, w / 4, 0, Math.PI)
      ctx.lineTo(x + dx - w / 2, y)
      ctx.closePath()
      ctx.fill()
    }
  }
}

const PaintCanvasGame = forwardRef<PaintCanvasGameHandle>(function PaintCanvasGame(_, ref) {
  const toast = useToast()
  const wrapRef = useRef<HTMLDivElement>(null)
  const paintRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)

  const [tool, setTool] = useState<Tool>('lanzar')
  const [color, setColor] = useState('#0073E6')
  const [size, setSize] = useState(14)

  const stateRef = useRef({ tool, color, size })
  stateRef.current = { tool, color, size }

  const projectiles = useRef<Projectile[]>([])
  const drag = useRef({ active: false, ax: 0, ay: 0, cx: 0, cy: 0 })
  const painting = useRef(false)

  // Tamaño del canvas + preservar el dibujo al hacer resize
  useEffect(() => {
    const wrap = wrapRef.current
    const paint = paintRef.current
    const overlay = overlayRef.current
    if (!wrap || !paint || !overlay) return

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = window.devicePixelRatio || 1
      const snapshot = document.createElement('canvas')
      snapshot.width = paint.width
      snapshot.height = paint.height
      const sctx = snapshot.getContext('2d')
      if (sctx && snapshot.width > 0) sctx.drawImage(paint, 0, 0)

      for (const c of [paint, overlay]) {
        c.width = Math.max(1, Math.round(rect.width * dpr))
        c.height = Math.max(1, Math.round(rect.height * dpr))
        const ctx = c.getContext('2d')
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      const pctx = paint.getContext('2d')
      if (pctx && snapshot.width > 0) {
        pctx.drawImage(snapshot, 0, 0, rect.width, rect.height)
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  // Loop de animación: proyectiles + trayectoria de apuntado
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const overlay = overlayRef.current
      const paint = paintRef.current
      if (overlay && paint) {
        const octx = overlay.getContext('2d')
        const pctx = paint.getContext('2d')
        const w = overlay.clientWidth
        const h = overlay.clientHeight
        if (octx && pctx) {
          octx.clearRect(0, 0, w, h)
          const d = drag.current

          if (d.active && stateRef.current.tool === 'lanzar') {
            const vx = (d.ax - d.cx) * POWER
            const vy = (d.ay - d.cy) * POWER

            octx.strokeStyle = 'rgba(17, 24, 39, 0.35)'
            octx.lineWidth = 2
            octx.beginPath()
            octx.moveTo(d.ax, d.ay)
            octx.lineTo(d.cx, d.cy)
            octx.stroke()

            let px = d.ax
            let py = d.ay
            let pvx = vx
            let pvy = vy
            for (let i = 0; i < 30; i++) {
              pvy += GRAVITY
              px += pvx
              py += pvy
              if (px < 0 || px > w || py > h) break
              octx.beginPath()
              octx.fillStyle = stateRef.current.color
              octx.globalAlpha = Math.max(0.15, 1 - i / 30) * 0.7
              octx.arc(px, py, 3.5, 0, Math.PI * 2)
              octx.fill()
            }
            octx.globalAlpha = 1

            octx.beginPath()
            octx.fillStyle = stateRef.current.color
            octx.arc(d.ax, d.ay, stateRef.current.size, 0, Math.PI * 2)
            octx.fill()
          }

          projectiles.current = projectiles.current.filter((p) => {
            p.vy += GRAVITY
            p.x += p.vx
            p.y += p.vy

            const hitBottom = p.y >= h - p.size * 0.4
            const outSides = p.x < 0 || p.x > w
            const goneTop = p.y < -h * 1.5

            if (hitBottom || outSides) {
              const sx = Math.min(Math.max(p.x, 6), w - 6)
              const sy = Math.min(Math.max(p.y, 6), h - 6)
              drawSplat(pctx, sx, sy, p.color, p.size, p.vx, p.vy)
              return false
            }
            if (goneTop) return false

            octx.beginPath()
            octx.fillStyle = p.color
            octx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            octx.fill()
            return true
          })
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const getPos = (e: PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const { x, y } = getPos(e)
    const { tool, color, size } = stateRef.current

    if (tool === 'lanzar') {
      drag.current = { active: true, ax: x, ay: y, cx: x, cy: y }
    } else {
      painting.current = true
      const pctx = paintRef.current?.getContext('2d')
      if (pctx) {
        pctx.fillStyle = color
        pctx.beginPath()
        pctx.arc(x, y, size / 2, 0, Math.PI * 2)
        pctx.fill()
      }
      drag.current = { active: false, ax: x, ay: y, cx: x, cy: y }
    }
  }

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getPos(e)
    const { tool, color, size } = stateRef.current

    if (tool === 'lanzar') {
      if (drag.current.active) {
        drag.current.cx = x
        drag.current.cy = y
      }
    } else if (painting.current) {
      const pctx = paintRef.current?.getContext('2d')
      if (pctx) {
        pctx.strokeStyle = color
        pctx.lineWidth = size
        pctx.lineCap = 'round'
        pctx.lineJoin = 'round'
        pctx.beginPath()
        pctx.moveTo(drag.current.cx, drag.current.cy)
        pctx.lineTo(x, y)
        pctx.stroke()
      }
      drag.current.cx = x
      drag.current.cy = y
    }
  }

  const handlePointerUp = () => {
    const { tool, color, size } = stateRef.current

    if (tool === 'lanzar' && drag.current.active) {
      const d = drag.current
      const vx = (d.ax - d.cx) * POWER
      const vy = (d.ay - d.cy) * POWER
      drag.current.active = false
      if (Math.hypot(vx, vy) > 0.6) {
        projectiles.current.push({ x: d.ax, y: d.ay, vx, vy, color, size })
      } else {
        const pctx = paintRef.current?.getContext('2d')
        if (pctx) drawSplat(pctx, d.ax, d.ay, color, size, 2, 2)
      }
    }
    painting.current = false
  }

  const handlePointerCancel = () => {
    drag.current.active = false
    painting.current = false
  }

  const clearCanvas = () => {
    const paint = paintRef.current
    const pctx = paint?.getContext('2d')
    if (paint && pctx) {
      pctx.clearRect(0, 0, paint.clientWidth, paint.clientHeight)
    }
  }

  const exportPng = () => {
    const paint = paintRef.current
    if (!paint) return null
    const out = document.createElement('canvas')
    out.width = paint.width
    out.height = paint.height
    const octx = out.getContext('2d')
    if (!octx) return null
    octx.fillStyle = '#ffffff'
    octx.fillRect(0, 0, out.width, out.height)
    octx.drawImage(paint, 0, 0)
    return out.toDataURL('image/png')
  }

  const downloadArt = () => {
    const dataUrl = exportPng()
    if (!dataUrl) return
    const link = document.createElement('a')
    link.download = 'mi-obra-acuario-kids.png'
    link.href = dataUrl
    link.click()
  }

  const saveArt = () => {
    const dataUrl = exportPng()
    if (!dataUrl) return
    try {
      const artwork = saveArtwork(dataUrl)
      toast.success('¡Obra guardada!', `Se guardó "${artwork.name}" en tu galería`)
    } catch {
      toast.error('No se pudo guardar', 'La galería está llena. Borra alguna obra.')
    }
  }

  useImperativeHandle(ref, () => ({
    loadImage: (dataUrl: string) => {
      const paint = paintRef.current
      if (!paint) return
      const img = new Image()
      img.onload = () => {
        const pctx = paint.getContext('2d')
        if (pctx) {
          pctx.drawImage(img, 0, 0, paint.clientWidth, paint.clientHeight)
        }
      }
      img.src = dataUrl
    },
  }))

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-gray-200 bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setTool('lanzar')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tool === 'lanzar' ? 'bg-primary-600 text-white shadow' : 'text-gray-700 hover:bg-white'
            }`}
          >
            <Droplets size={18} />
            Lanzar
          </button>
          <button
            type="button"
            onClick={() => setTool('brocha')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tool === 'brocha' ? 'bg-primary-600 text-white shadow' : 'text-gray-700 hover:bg-white'
            }`}
          >
            <Paintbrush size={18} />
            Brocha
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          Tamaño
          <input
            type="range"
            min={4}
            max={30}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-28 accent-primary-600"
          />
        </label>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            Limpiar
          </button>
          <button
            type="button"
            onClick={saveArt}
            className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Save size={16} />
            Guardar
          </button>
          <button
            type="button"
            onClick={downloadArt}
            className="flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <Download size={16} />
            Descargar
          </button>
        </div>
      </div>

      {/* Paleta de colores */}
      <div className="flex flex-wrap items-center gap-2">
        {COLORS.map((c) => (
          <button
            key={c.hex}
            type="button"
            title={c.name}
            aria-label={`Color ${c.name}`}
            onClick={() => setColor(c.hex)}
            className={`h-9 w-9 rounded-full border-2 transition-transform sm:h-10 sm:w-10 ${
              color === c.hex ? 'scale-110 border-gray-900 ring-2 ring-gray-300' : 'border-white shadow'
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

      {/* Lienzo */}
      <div
        ref={wrapRef}
        className="relative h-[60vh] min-h-[360px] max-h-[620px] w-full touch-none select-none overflow-hidden rounded-2xl border-4 border-dashed border-gray-300 bg-white shadow-inner"
      >
        <canvas ref={paintRef} className="absolute inset-0 h-full w-full" />
        <canvas
          ref={overlayRef}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        />
        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
          {tool === 'lanzar'
            ? 'Mantén presionado, arrastra para apuntar y suelta para lanzar'
            : 'Pinta libremente sobre el lienzo'}
        </div>
      </div>
    </div>
  )
})

export default PaintCanvasGame
