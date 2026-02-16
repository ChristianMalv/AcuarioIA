import { NextResponse } from 'next/server'
import { migrateToLocationInventory } from '@/lib/migrate-inventory'

export async function POST() {
  try {
    const result = await migrateToLocationInventory()
    return NextResponse.json({ 
      message: 'Inventory migration completed successfully',
      ...result 
    })
  } catch (error) {
    console.error('Error during inventory migration:', error)
    return NextResponse.json(
      { error: 'Error during inventory migration' },
      { status: 500 }
    )
  }
}
