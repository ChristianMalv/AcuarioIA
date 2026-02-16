import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/carousel - Get all slides
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const slides = await prisma.carouselSlide.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })

    return NextResponse.json(slides)
  } catch (error) {
    console.error('Error fetching carousel slides:', error)
    return NextResponse.json(
      { error: 'Error al obtener las imágenes del carrusel' },
      { status: 500 }
    )
  }
}

// POST /api/carousel - Create new slide
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body?.image || typeof body.image !== 'string') {
      return NextResponse.json(
        { error: 'La imagen es requerida' },
        { status: 400 }
      )
    }

    if (!body?.alt || typeof body.alt !== 'string') {
      return NextResponse.json(
        { error: 'El texto alternativo (alt) es requerido' },
        { status: 400 }
      )
    }

    const slide = await prisma.carouselSlide.create({
      data: {
        image: body.image,
        alt: body.alt,
        title: body.title || null,
        description: body.description || null,
        layersJson: typeof body.layersJson === 'string' ? body.layersJson : null,
        textJson: typeof body.textJson === 'string' ? body.textJson : null,
        active: body.active !== undefined ? body.active : true,
        order: body.order || 0
      } as any
    })

    return NextResponse.json(slide, { status: 201 })
  } catch (error) {
    console.error('Error creating carousel slide:', error)
    return NextResponse.json(
      { error: 'Error al crear la imagen del carrusel' },
      { status: 500 }
    )
  }
}
