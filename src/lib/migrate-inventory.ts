import { prisma } from './prisma'

export async function migrateToLocationInventory() {
  try {
    console.log('Starting inventory migration...')
    
    // Obtener todos los productos existentes
    const products = await prisma.product.findMany()
    
    for (const product of products) {
      // Verificar si ya existe inventario para CDMX
      const existingCdmx = await prisma.inventory.findUnique({
        where: {
          productId_location: {
            productId: product.id,
            location: 'cdmx'
          }
        }
      })
      
      if (!existingCdmx) {
        await prisma.inventory.create({
          data: {
            productId: product.id,
            location: 'cdmx',
            stock: Math.floor(Math.random() * 50) + 10, // Stock aleatorio entre 10-60
            minStock: 5,
            maxStock: 100
          }
        })
      }
      
      // Verificar si ya existe inventario para Mérida
      const existingMerida = await prisma.inventory.findUnique({
        where: {
          productId_location: {
            productId: product.id,
            location: 'merida'
          }
        }
      })
      
      if (!existingMerida) {
        await prisma.inventory.create({
          data: {
            productId: product.id,
            location: 'merida',
            stock: Math.floor(Math.random() * 40) + 5, // Stock aleatorio entre 5-45
            minStock: 3,
            maxStock: 80
          }
        })
      }
    }
    
    console.log(`Migration completed for ${products.length} products`)
    return { success: true, productsProcessed: products.length }
  } catch (error) {
    console.error('Error during migration:', error)
    throw error
  }
}
