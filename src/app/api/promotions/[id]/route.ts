import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/promotions/[id] - Get single promotion
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const promotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!promotion) {
      return NextResponse.json(
        { error: 'Promoción no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error fetching promotion:', error)
    return NextResponse.json(
      { error: 'Error al obtener la promoción' },
      { status: 500 }
    )
  }
}

// PUT /api/promotions/[id] - Update promotion
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        discount: body.discount,
        validUntil: new Date(body.validUntil),
        image: body.image,
        ctaText: body.ctaText,
        ctaLink: body.ctaLink,
        type: body.type,
        featured: body.featured,
        active: body.active,
        order: body.order
      }
    })

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error updating promotion:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la promoción' },
      { status: 500 }
    )
  }
}

// DELETE /api/promotions/[id] - Delete promotion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.promotion.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Promoción eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting promotion:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la promoción' },
      { status: 500 }
    )
  }
}
