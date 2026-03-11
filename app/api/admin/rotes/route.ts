import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/admin/rotes - Get all rotes with user info (admin panel)
export async function GET() {
  try {
    const rotes = await prisma.rote.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })
    return NextResponse.json(rotes)
  } catch (error) {
    console.error('Error fetching rotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rotes' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/rotes/[id] - Delete any rote (admin panel)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    
    await prisma.rote.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting rote:', error)
    return NextResponse.json(
      { error: 'Failed to delete rote' },
      { status: 500 }
    )
  }
}
