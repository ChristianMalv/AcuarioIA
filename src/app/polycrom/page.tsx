'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'

type PolycromColor = {
  code: string
  name: string
  hex: string
  group?: string
}

type BasicColor =
  | 'Rojo'
  | 'Anaranjado'
  | 'Amarillo'
  | 'Verde'
  | 'Azul'
  | 'Morado'
  | 'Café'
  | 'Gris'
  | 'Blanco'
  | 'Negro'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const n = hex.replace('#', '').trim()
  if (!/^[0-9a-fA-F]{6}$/.test(n)) return null
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  }
}

function rgbToHsv({ r, g, b }: { r: number; g: number; b: number }): { h: number; s: number; v: number } {
  const rp = r / 255
  const gp = g / 255
  const bp = b / 255
  const max = Math.max(rp, gp, bp)
  const min = Math.min(rp, gp, bp)
  const d = max - min

  let h = 0
  if (d !== 0) {
    if (max === rp) h = ((gp - bp) / d) % 6
    else if (max === gp) h = (bp - rp) / d + 2
    else h = (rp - gp) / d + 4
    h *= 60
    if (h < 0) h += 360
  }

  const s = max === 0 ? 0 : d / max
  const v = max
  return { h, s, v }
}

function basicColorFromHex(hex: string): BasicColor {
  const rgb = hexToRgb(hex)
  if (!rgb) return 'Gris'
  const { h, s, v } = rgbToHsv(rgb)

  if (v <= 0.12) return 'Negro'
  if (v >= 0.93 && s <= 0.12) return 'Blanco'
  if (s <= 0.10) return 'Gris'

  const isBrown = h >= 15 && h < 50 && v < 0.65
  if (isBrown) return 'Café'

  if (h < 20 || h >= 340) return 'Rojo'
  if (h < 45) return 'Anaranjado'
  if (h < 70) return 'Amarillo'
  if (h < 160) return 'Verde'
  if (h < 260) return 'Azul'
  return 'Morado'
}

const basicColorOrder: Record<BasicColor, number> = {
  Rojo: 1,
  Anaranjado: 2,
  Amarillo: 3,
  Verde: 4,
  Azul: 5,
  Morado: 6,
  Café: 7,
  Gris: 8,
  Blanco: 9,
  Negro: 10,
}

const basicColorChipStyles: Record<BasicColor, { bg: string; text: string; border: string }> = {
  Azul: { bg: '#2563EB', text: '#FFFFFF', border: '#1D4ED8' },
  Rojo: { bg: '#DC2626', text: '#FFFFFF', border: '#B91C1C' },
  Verde: { bg: '#16A34A', text: '#FFFFFF', border: '#15803D' },
  Amarillo: { bg: '#FACC15', text: '#111827', border: '#EAB308' },
  Anaranjado: { bg: '#F97316', text: '#FFFFFF', border: '#EA580C' },
  Morado: { bg: '#7C3AED', text: '#FFFFFF', border: '#6D28D9' },
  Café: { bg: '#8B5E34', text: '#FFFFFF', border: '#7C4A25' },
  Gris: { bg: '#9CA3AF', text: '#111827', border: '#6B7280' },
  Blanco: { bg: '#FFFFFF', text: '#111827', border: '#D1D5DB' },
  Negro: { bg: '#111827', text: '#FFFFFF', border: '#111827' },
}

function compareApCode(a: string, b: string): number {
  const ra = a.match(/^AP(\d+)-(\d+)$/i)
  const rb = b.match(/^AP(\d+)-(\d+)$/i)
  if (!ra || !rb) return a.localeCompare(b)
  const a1 = Number(ra[1])
  const a2 = Number(ra[2])
  const b1 = Number(rb[1])
  const b2 = Number(rb[2])
  if (a1 !== b1) return a1 - b1
  return a2 - b2
}

function normalizeHex(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  const withHash = raw.startsWith('#') ? raw : `#${raw}`
  const match = withHash.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  return match ? withHash.toUpperCase() : null
}

function getTextColorForBg(hex: string): string {
  const n = hex.replace('#', '')
  const r = parseInt(n.substring(0, 2), 16)
  const g = parseInt(n.substring(2, 4), 16)
  const b = parseInt(n.substring(4, 6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 160 ? '#111827' : '#FFFFFF'
}

type PolycromLine = 'master' | 'classic' | 'mil' | 'gold'
type PolycromSize = 'galon' | 'cubeta'

const polycromLines: { id: PolycromLine; label: string }[] = [
  { id: 'master', label: 'Master' },
  { id: 'classic', label: 'Classic' },
  { id: 'mil', label: 'Mil' },
  { id: 'gold', label: 'Gold' },
]

function productFromPolycromColorWithPresentation(
  c: PolycromColor,
  normalizedHex: string | null,
  line: PolycromLine,
  size: PolycromSize
): Product {
  const sizeLabel = size === 'galon' ? 'Galón' : 'Cubeta'
  const lineLabel = polycromLines.find((l) => l.id === line)?.label ?? 'Master'
  return {
    id: `polycrom-${c.code}-${line}-${size}`,
    name: `Línea ${lineLabel} ${sizeLabel} - ${c.code} ${c.name}`,
    description: `Línea ${lineLabel} ${sizeLabel} • Polycrom ${c.code}${c.group ? ` • ${c.group}` : ''}`,
    price: 0,
    image: '',
    category: 'vinilica',
    brand: 'Acuario',
    size: sizeLabel,
    color: normalizedHex ?? c.hex,
  }
}

function PolycromPageInner() {
  const searchParams = useSearchParams()
  const { addToCart } = useCart()
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<string>('')
  const [basicColor, setBasicColor] = useState<BasicColor | ''>('')
  const [sortMode, setSortMode] = useState<'ap' | 'basic'>('ap')
  const [page, setPage] = useState(1)
  const [colors, setColors] = useState<PolycromColor[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const pageSize = 60

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/polycrom')
        if (!res.ok) return
        const data = (await res.json()) as PolycromColor[]
        if (Array.isArray(data)) setColors(data)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    const raw = searchParams.get('sel')
    if (!raw) return
    const codes = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (codes.length === 0) return
    setSelected(new Set(codes))
    setShowSelectedOnly(true)
  }, [searchParams])

  const groups = useMemo(() => {
    const set = new Set<string>()
    for (const c of colors) {
      if (c.group) set.add(c.group)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [colors])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = colors.slice().sort((a, b) => {
      if (sortMode === 'basic') {
        const ah = normalizeHex(a.hex)
        const bh = normalizeHex(b.hex)
        const ac = ah ? basicColorFromHex(ah) : 'Gris'
        const bc = bh ? basicColorFromHex(bh) : 'Gris'
        if (basicColorOrder[ac] !== basicColorOrder[bc]) return basicColorOrder[ac] - basicColorOrder[bc]
      }
      return compareApCode(a.code, b.code)
    })

    return sorted.filter((c) => {
      if (showSelectedOnly && !selected.has(c.code)) return false

      const matchesGroup = !group || c.group === group
      if (!matchesGroup) return false

      if (basicColor) {
        const h = normalizeHex(c.hex)
        const bc = h ? basicColorFromHex(h) : 'Gris'
        if (bc !== basicColor) return false
      }

      if (!q) return true
      return (
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.hex.toLowerCase().includes(q)
      )
    })
  }, [colors, query, group, basicColor, sortMode, showSelectedOnly, selected])

  useEffect(() => {
    setPage(1)
  }, [query, group, basicColor, sortMode, showSelectedOnly])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Polycrom</h1>
          <p className="text-gray-600">
            Busca por código o nombre. Cada tarjeta muestra el color.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="polycrom-search">
              Buscar
            </label>
            <input
              id="polycrom-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: AP17-1, First Peony, #E7C9D2"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="w-full md:w-72">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="polycrom-group">
              Gama
            </label>
            <select
              id="polycrom-group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={groups.length === 0}
            >
              <option value="">Todas</option>
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-72">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="polycrom-sort">
              Ordenar
            </label>
            <select
              id="polycrom-sort"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as 'ap' | 'basic')}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ap">Código AP</option>
              <option value="basic">Color básico</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">Color básico</div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setBasicColor('')}
              className={`px-3 py-2 rounded-full border text-sm ${
                basicColor === ''
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              Todos
            </button>
            {([
              'Azul',
              'Rojo',
              'Verde',
              'Amarillo',
              'Anaranjado',
              'Morado',
              'Café',
              'Gris',
              'Blanco',
              'Negro',
            ] as BasicColor[]).map((c) => {
              const style = basicColorChipStyles[c]
              const active = basicColor === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBasicColor(c)}
                  className="px-3 py-2 rounded-full border text-sm"
                  style={{
                    backgroundColor: style.bg,
                    color: style.text,
                    borderColor: active ? '#111827' : style.border,
                    boxShadow: active ? '0 0 0 2px rgba(17,24,39,0.35)' : undefined,
                  }}
                  title={c}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
          <div className="text-sm text-gray-700">
            Seleccionados: {selected.size}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 inline-flex items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={showSelectedOnly}
                onChange={(e) => setShowSelectedOnly(e.target.checked)}
                disabled={selected.size === 0}
              />
              <span>Mostrar solo seleccionados</span>
            </label>
            <button
              type="button"
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 disabled:opacity-50"
              onClick={() => {
                setSelected(new Set())
                setShowSelectedOnly(false)
              }}
              disabled={selected.size === 0}
            >
              Limpiar selección
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded-lg bg-primary-600 text-white disabled:opacity-50"
              disabled={selected.size === 0}
              onClick={() => {
                const sel = Array.from(selected)
                sel.sort(compareApCode)
                const qs = new URLSearchParams()
                qs.set('sel', sel.join(','))
                const url = `${window.location.origin}/polycrom?${qs.toString()}`
                setShareUrl(url)
              }}
            >
              Generar enlace
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 disabled:opacity-50"
              disabled={!shareUrl}
              onClick={async () => {
                if (!shareUrl) return
                try {
                  await navigator.clipboard.writeText(shareUrl)
                } catch {
                  // ignore
                }
              }}
            >
              Copiar
            </button>
          </div>
        </div>

        {shareUrl ? (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-600 mb-1">Enlace para compartir</div>
            <div className="font-mono text-sm break-all text-gray-900">{shareUrl}</div>
          </div>
        ) : null}

        <div className="text-sm text-gray-600 mb-4">
          {loading ? 'Cargando…' : `${filtered.length} resultado${filtered.length === 1 ? '' : 's'}`}
        </div>

        {!loading && filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-gray-700">
            No hay colores para mostrar. Pega tu lista en{' '}
            <code className="px-1 py-0.5 rounded bg-gray-100">src/data/polycrom.tsv</code>.
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Siguiente
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((c) => {
                const hex = normalizeHex(c.hex)
                const bg = hex ?? '#FFFFFF'
                const lineSelectId = `polycrom-line-${c.code}`
                const sizeSelectId = `polycrom-size-${c.code}`

                return (
                  <div key={c.code} className="rounded-xl border border-gray-200 bg-white overflow-visible">
                    <div className="p-4">
                      <div className="flex justify-center mb-3">
                        <div className="relative group" style={{ width: '169.99px', height: '99.99px' }}>
                          <div
                            className="rounded-lg border border-black/10 transition-transform duration-150 ease-out group-hover:scale-[1.35] group-hover:shadow-lg"
                            style={{ backgroundColor: bg, width: '169.99px', height: '99.99px' }}
                          />

                          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100">
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[260px]" style={{ transform: 'translate(-50%, calc(-100% - 24px))' }}>
                              <div className="rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                                <div className="p-3">
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-gray-900">{c.code}</div>
                                  </div>
                                  <div className="text-sm text-gray-700 mt-1 line-clamp-2">{c.name}</div>
                                  {c.group ? <div className="text-xs text-gray-500 mt-1">{c.group}</div> : null}
                                </div>

                                <div className="p-3 pt-0">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="rounded-md border border-black/10"
                                      style={{ backgroundColor: bg, width: 28, height: 28 }}
                                    />
                                    <div className="text-xs text-gray-600">Selecciona presentación</div>
                                  </div>

                                  <div className="mt-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <select
                                        id={lineSelectId}
                                        defaultValue="master"
                                        className="pointer-events-auto w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                                      >
                                        {polycromLines.map((l) => (
                                          <option key={l.id} value={l.id}>
                                            {l.label}
                                          </option>
                                        ))}
                                      </select>
                                      <select
                                        id={sizeSelectId}
                                        defaultValue="galon"
                                        className="pointer-events-auto w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                                      >
                                        <option value="galon">Galón</option>
                                        <option value="cubeta">Cubeta</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-3 bg-gray-50 border-t border-gray-100">
                                  <button
                                    type="button"
                                    className="pointer-events-auto w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                                    onClick={() => {
                                      const lineEl = document.getElementById(lineSelectId) as HTMLSelectElement | null
                                      const sizeEl = document.getElementById(sizeSelectId) as HTMLSelectElement | null
                                      const line = (lineEl?.value as PolycromLine) ?? 'master'
                                      const size = (sizeEl?.value as PolycromSize) ?? 'galon'
                                      addToCart(productFromPolycromColorWithPresentation(c, hex, line, size), 1)
                                    }}
                                  >
                                    Agregar al carrito
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 mb-2 select-none">
                        <input
                          type="checkbox"
                          checked={selected.has(c.code)}
                          onChange={(e) => {
                            setSelected((prev) => {
                              const next = new Set(prev)
                              if (e.target.checked) next.add(c.code)
                              else next.delete(c.code)
                              return next
                            })
                          }}
                        />
                        <span className="text-sm text-gray-700">Seleccionar</span>
                      </label>

                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-gray-900">{c.code}</div>
                      </div>

                      <div className="font-semibold text-gray-900">{c.name}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {polycromLines.map((l) => (
                          <span
                            key={l.id}
                            className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700"
                          >
                            {l.label}
                          </span>
                        ))}
                      </div>
                      {c.group ? (
                        <div className="mt-1 text-sm text-gray-600">{c.group}</div>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function PolycromPage() {
  return (
    <Suspense>
      <PolycromPageInner />
    </Suspense>
  )
}
