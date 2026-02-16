import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { error: 'No se encontró ningún archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen' },
        { status: 400 }
      )
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'La imagen debe ser menor a 5MB' },
        { status: 400 }
      )
    }

    // Generar nombre único para el archivo
    const uniqueId = crypto.randomUUID()
    const extension = file.name.split('.').pop()
    const filename = `product-${uniqueId}.${extension}`

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), 'public', 'images')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Convertir archivo a buffer y guardarlo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = join(uploadDir, filename)
    
    await writeFile(filepath, buffer)

    // Retornar la URL pública de la imagen
    const imageUrl = `/images/${filename}`

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      filename: filename
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al subir la imagen' },
      { status: 500 }
    )
  }
}
