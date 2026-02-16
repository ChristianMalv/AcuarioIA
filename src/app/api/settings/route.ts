import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULTS: Record<string, string> = {
  carouselImageFit: 'contain'
}

// GET /api/settings - Get settings (optionally filter by keys)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keysParam = searchParams.get('keys')
    const keys = keysParam
      ? keysParam.split(',').map(k => k.trim()).filter(Boolean)
      : []

    const settings = await prisma.appSetting.findMany({
      where: keys.length > 0 ? { key: { in: keys } } : undefined
    })

    const map: Record<string, string> = {}
    for (const s of settings) map[s.key] = s.value

    if (keys.length > 0) {
      for (const k of keys) {
        if (map[k] === undefined && DEFAULTS[k] !== undefined) map[k] = DEFAULTS[k]
      }
    } else {
      for (const [k, v] of Object.entries(DEFAULTS)) {
        if (map[k] === undefined) map[k] = v
      }
    }

    return NextResponse.json(map)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Error al obtener la configuración' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Upsert settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Body inválido' },
        { status: 400 }
      )
    }

    const entries = Object.entries(body as Record<string, unknown>)
      .filter(([k]) => typeof k === 'string' && k.length > 0)
      .map(([k, v]) => [k, v === null || v === undefined ? '' : String(v)] as const)

    if (entries.length === 0) {
      return NextResponse.json(
        { error: 'No se enviaron settings para guardar' },
        { status: 400 }
      )
    }

    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.appSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Error al guardar la configuración' },
      { status: 500 }
    )
  }
}
