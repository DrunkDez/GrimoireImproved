import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const ADMIN_PASSWORD = 'TruthUntilParadox'

// DELETE /api/admin/delete-all - Delete all rotes (requires password)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete all rotes
    const result = await prisma.rote.deleteMany({})

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count 
    })
  } catch (error) {
    console.error('Error deleting all rotes:', error)
    return NextResponse.json(
      { error: 'Failed to delete rotes' },
      { status: 500 }
    )
  }
}
