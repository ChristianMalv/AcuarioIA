import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/[id] - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: {
        id: id
      }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Actualizar producto e inventario en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar el producto (sin campo stock)
      const product = await tx.product.update({
        where: {
          id: id
        },
        data: {
          name: body.name,
          description: body.description,
          price: parseFloat(body.price),
          category: body.category,
          brand: body.brand,
          size: body.size,
          color: body.color || null,
          featured: body.featured || false,
          image: body.image || null
        }
      })
      
      // Actualizar inventario si se proporciona stock
      if (body.stock !== undefined) {
        const stockAmount = parseInt(body.stock) || 0
        
        // Actualizar inventario para ambas ubicaciones
        await tx.inventory.updateMany({
          where: {
            productId: id
          },
          data: {
            stock: stockAmount
          }
        })
      }
      
      return product
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Deleting product with ID:', id)
    
    // Verificar si el producto existe
    const product = await prisma.product.findUnique({
      where: { id }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    
    // Verificar si hay órdenes que referencian este producto
    const orderItems = await prisma.orderItem.findMany({
      where: { productId: id }
    })
    
    if (orderItems.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar el producto porque está asociado a órdenes existentes. Considera desactivarlo en lugar de eliminarlo.' },
        { status: 400 }
      )
    }
    
    // Eliminar el producto (esto eliminará automáticamente los registros de inventario debido al onDelete: Cascade)
    await prisma.product.delete({
      where: {
        id: id
      }
    })
    
    return NextResponse.json({ message: 'Producto eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}
