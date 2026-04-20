import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/product-images/[id]/primary
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const image = await (prisma as any).productImage.findUnique({
      where: { id },
      select: { id: true, productId: true, url: true },
    })

    if (!image) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await (tx as any).productImage.updateMany({
        where: { productId: image.productId },
        data: { isPrimary: false },
      })

      await (tx as any).productImage.update({
        where: { id: image.id },
        data: { isPrimary: true },
      })

      await (tx as any).product.update({
        where: { id: image.productId },
        data: { image: image.url },
      })
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error setting primary image:', error)
    return NextResponse.json({ error: 'Error al marcar como principal' }, { status: 500 })
  }
}
