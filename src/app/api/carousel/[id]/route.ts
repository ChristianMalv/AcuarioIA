import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/carousel/[id] - Get single slide
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const slide = await prisma.carouselSlide.findUnique({
      where: { id }
    })

    if (!slide) {
      return NextResponse.json(
        { error: 'Imagen del carrusel no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error fetching carousel slide:', error)
    return NextResponse.json(
      { error: 'Error al obtener la imagen del carrusel' },
      { status: 500 }
    )
  }
}

// PUT /api/carousel/[id] - Update slide
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const data: Record<string, unknown> = {}
    if (body.image !== undefined) data.image = body.image
    if (body.alt !== undefined) data.alt = body.alt
    if (body.title !== undefined) data.title = body.title
    if (body.description !== undefined) data.description = body.description
    if (body.active !== undefined) data.active = body.active
    if (body.order !== undefined) data.order = body.order
    if (body.layersJson !== undefined) data.layersJson = typeof body.layersJson === 'string' ? body.layersJson : null
    if (body.textJson !== undefined) data.textJson = typeof body.textJson === 'string' ? body.textJson : null

    const slide = await prisma.carouselSlide.update({
      where: { id },
      data: data as any
    })

    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error updating carousel slide:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la imagen del carrusel' },
      { status: 500 }
    )
  }
}

// DELETE /api/carousel/[id] - Delete slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.carouselSlide.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Imagen del carrusel eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting carousel slide:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la imagen del carrusel' },
      { status: 500 }
    )
  }
}
