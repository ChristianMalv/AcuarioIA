import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { 
      customerInfo, 
      items, 
      total, 
      location,
      customerId 
    } = await request.json()

    // Validar campos requeridos
    if (!customerInfo || !items || !total || !location) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (!items.length) {
      return NextResponse.json(
        { error: 'No hay productos en el pedido' },
        { status: 400 }
      )
    }

    // Verificar stock disponible antes de crear el pedido
    for (const item of items) {
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId: item.id,
          location: location.toLowerCase()
        }
      })

      if (!inventory || inventory.stock < item.quantity) {
        const product = await prisma.product.findUnique({
          where: { id: item.id },
          select: { name: true }
        })
        
        return NextResponse.json(
          { 
            error: `Stock insuficiente para ${product?.name || 'el producto'}. Stock disponible: ${inventory?.stock || 0}` 
          },
          { status: 400 }
        )
      }
    }

    // Crear el pedido en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear el pedido
      const order = await tx.order.create({
        data: {
          customerId: customerId || null,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone || null,
          shippingAddress: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state}, CP: ${customerInfo.zipCode}`,
          total: total,
          location: location.toLowerCase(),
          status: 'pending'
        }
      })

      // Crear los items del pedido y actualizar inventario
      for (const item of items) {
        // Crear item del pedido
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }
        })

        // Actualizar inventario
        await tx.inventory.updateMany({
          where: {
            productId: item.id,
            location: location.toLowerCase()
          },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      return order
    })

    // Obtener el pedido completo con sus items para la respuesta
    const completeOrder = await prisma.order.findUnique({
      where: { id: result.id },
      include: {
        items: true
      }
    })

    return NextResponse.json({
      message: 'Pedido creado exitosamente',
      order: completeOrder
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let whereClause = {}
    if (customerId) {
      whereClause = { customerId }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.order.count({
      where: whereClause
    })

    return NextResponse.json({
      orders,
      totalCount,
      hasMore: offset + limit < totalCount
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
