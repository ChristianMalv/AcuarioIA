import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validar campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar cliente por email
    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        isActive: true,
        createdAt: true
      }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // Verificar si la cuenta está activa
    if (!customer.isActive) {
      return NextResponse.json(
        { error: 'Cuenta desactivada. Contacta al soporte' },
        { status: 403 }
      )
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, customer.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // Remover password de la respuesta
    const { password: _, ...customerData } = customer

    return NextResponse.json({
      message: 'Login exitoso',
      customer: customerData
    })

  } catch (error) {
    console.error('Error logging in customer:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
