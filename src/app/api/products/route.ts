import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products - Obtener todos los productos con información de inventario
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        inventory: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Transformar los datos para incluir stock total y por ubicación
    const productsWithStock = products.map((product: any) => {
      const totalStock = product.inventory.reduce((sum: number, inv: any) => sum + inv.stock, 0)
      const cdmxInventory = product.inventory.find((inv: any) => inv.location === 'cdmx')
      const meridaInventory = product.inventory.find((inv: any) => inv.location === 'merida')
      
      return {
        ...product,
        stock: totalStock, // Stock total para compatibilidad con código existente
        stockCdmx: cdmxInventory?.stock || 0,
        stockMerida: meridaInventory?.stock || 0,
        minStock: cdmxInventory?.minStock || 0,
        maxStock: cdmxInventory?.maxStock || 0,
        inventory: undefined // Remover el array de inventory del response para mantener compatibilidad
      }
    })
    
    return NextResponse.json(productsWithStock)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST /api/products - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Crear producto e inventario en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear el producto sin el campo stock
      const product = await (tx as any).product.create({
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
      
      // Crear inventario para ambas ubicaciones
      const stockAmount = parseInt(body.stock) || 0
      
      await (tx as any).inventory.createMany({
        data: [
          {
            productId: product.id,
            location: 'cdmx',
            stock: stockAmount,
            minStock: 5,
            maxStock: 100
          },
          {
            productId: product.id,
            location: 'merida',
            stock: stockAmount,
            minStock: 5,
            maxStock: 100
          }
        ]
      })
      
      return product
    })
    
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
