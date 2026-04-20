import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE /api/admin/product-images/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const image = await (prisma as any).productImage.findUnique({
      where: { id },
      select: { id: true, productId: true, url: true, isPrimary: true },
    })

    if (!image) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await (tx as any).productImage.delete({ where: { id: image.id } })

      if (image.isPrimary) {
        const nextPrimary = await (tx as any).productImage.findFirst({
          where: { productId: image.productId },
          orderBy: { createdAt: 'desc' },
          select: { url: true },
        })

        await (tx as any).product.update({
          where: { id: image.productId },
          data: { image: nextPrimary?.url ?? null },
        })

        if (nextPrimary) {
          await (tx as any).productImage.updateMany({
            where: { productId: image.productId, url: nextPrimary.url },
            data: { isPrimary: true },
          })
        }
      }
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error deleting product image:', error)
    return NextResponse.json({ error: 'Error al eliminar imagen' }, { status: 500 })
  }
}
