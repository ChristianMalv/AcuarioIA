import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/by-location/[location] - Obtener productos con stock por ubicación
export async function GET(
  request: NextRequest,
  { params }: { params: { location: string } }
) {
  try {
    const location = params.location
    
    // Validar que la ubicación sea válida
    if (location !== 'cdmx' && location !== 'merida') {
      return NextResponse.json(
        { error: 'Ubicación no válida. Use "cdmx" o "merida"' },
        { status: 400 }
      )
    }

    const products = await prisma.product.findMany({
      include: {
        inventory: {
          where: {
            location: location
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transformar los datos para incluir el stock de la ubicación específica
    const productsWithLocationStock = products.map(product => {
      const locationInventory = product.inventory[0]
      return {
        ...product,
        stock: locationInventory?.stock || 0,
        minStock: locationInventory?.minStock || 0,
        maxStock: locationInventory?.maxStock || 0,
        inventoryId: locationInventory?.id,
        // Mantener la estructura original pero con stock específico de ubicación
        inventory: undefined // Remover el array de inventory del response
      }
    })

    // Filtrar solo productos que tienen stock en esta ubicación
    const availableProducts = productsWithLocationStock.filter(product => product.stock > 0)
    
    return NextResponse.json(availableProducts)
  } catch (error) {
    console.error('Error fetching products by location:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos por ubicación' },
      { status: 500 }
    )
  }
}
