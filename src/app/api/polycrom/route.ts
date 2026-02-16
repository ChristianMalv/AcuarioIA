import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

type PolycromColor = {
  code: string
  name: string
  hex: string
  group?: string
}

function groupFromApCode(code: string): string | undefined {
  const m = code.match(/^AP(\d+)-(\d+)$/i)
  if (!m) return undefined
  const n = Number(m[1])
  if (!Number.isFinite(n)) return undefined

  if (n >= 1 && n <= 14) return 'Off Whites'
  if (n >= 15 && n <= 22) return 'Pastels'
  if (n >= 23 && n <= 57) return 'Neutral & Natural'
  if (n >= 58 && n <= 105) return 'Clean & Bright'
  if (n >= 106 && n <= 152) return 'Soft & Muted'
  if (n >= 153 && n <= 171) return 'Accents'
  return undefined
}

function parsePolycromTSV(tsv: string): PolycromColor[] {
  const lines = tsv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const out: PolycromColor[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (i === 0 && /Nombre del color/i.test(line) && /Hex/i.test(line) && /C[óo]digo/i.test(line)) {
      continue
    }

    const parts = line.includes('\t') ? line.split('\t') : line.split(/\s{2,}/)
    if (parts.length < 3) continue

    const name = parts[0].trim()
    const hex = parts[1].replace(/\s+/g, '').trim()
    const code = parts[2].replace(/\s+/g, '').trim()

    if (!name || !hex || !code) continue

    out.push({ code, name, hex, group: groupFromApCode(code) })
  }

  return out
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'polycrom.tsv')
    const tsv = await readFile(filePath, 'utf8')
    const colors = parsePolycromTSV(tsv)
    return NextResponse.json(colors)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
