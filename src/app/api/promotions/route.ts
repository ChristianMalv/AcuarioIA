import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/promotions - Get all promotions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'
    
    const promotions = await prisma.promotion.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(promotions)
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return NextResponse.json(
      { error: 'Error al obtener las promociones' },
      { status: 500 }
    )
  }
}

// POST /api/promotions - Create new promotion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const promotion = await prisma.promotion.create({
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
        featured: body.featured || false,
        active: body.active !== undefined ? body.active : true,
        order: body.order || 0
      }
    })

    return NextResponse.json(promotion, { status: 201 })
  } catch (error) {
    console.error('Error creating promotion:', error)
    return NextResponse.json(
      { error: 'Error al crear la promoción' },
      { status: 500 }
    )
  }
}
