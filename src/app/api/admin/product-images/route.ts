import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/product-images?sku=XXX
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sku = searchParams.get('sku')?.trim()

    if (!sku) {
      return NextResponse.json({ error: 'SKU requerido' }, { status: 400 })
    }

    const product = await (prisma as any).product.findFirst({
      where: { sku },
      include: {
        images: {
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product images:', error)
    return NextResponse.json({ error: 'Error al obtener imágenes' }, { status: 500 })
  }
}

// POST /api/admin/product-images
// body: { sku: string, url: string, alt?: string, makePrimary?: boolean }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const sku = String(body?.sku ?? '').trim()
    const url = String(body?.url ?? '').trim()
    const alt = body?.alt !== undefined ? String(body.alt).trim() : null
    const makePrimary = Boolean(body?.makePrimary)

    if (!sku) return NextResponse.json({ error: 'SKU requerido' }, { status: 400 })
    if (!url) return NextResponse.json({ error: 'URL requerida' }, { status: 400 })

    const product = await (prisma as any).product.findFirst({ where: { sku }, select: { id: true } })
    if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })

    const result = await prisma.$transaction(async (tx) => {
      if (makePrimary) {
        await (tx as any).productImage.updateMany({
          where: { productId: product.id },
          data: { isPrimary: false },
        })
      }

      const image = await (tx as any).productImage.upsert({
        where: {
          productId_url: {
            productId: product.id,
            url,
          },
        },
        create: {
          productId: product.id,
          url,
          alt,
          isPrimary: makePrimary,
        },
        update: {
          alt,
          ...(makePrimary ? { isPrimary: true } : {}),
        },
      })

      if (makePrimary) {
        await (tx as any).product.update({
          where: { id: product.id },
          data: { image: url },
        })
      }

      return image
    })

    return NextResponse.json({ image: result }, { status: 201 })
  } catch (error) {
    console.error('Error creating product image:', error)
    return NextResponse.json({ error: 'Error al guardar imagen' }, { status: 500 })
  }
}
