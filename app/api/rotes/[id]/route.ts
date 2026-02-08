import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/rotes/[id] - Get a single rote
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rote = await prisma.rote.findUnique({
      where: { id: params.id },
    })

    if (!rote) {
      return NextResponse.json({ error: 'Rote not found' }, { status: 404 })
    }

    return NextResponse.json(rote)
  } catch (error) {
    console.error('Error fetching rote:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rote' },
      { status: 500 }
    )
  }
}

// PUT /api/rotes/[id] - Update a rote
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, tradition, description, spheres, level, pageRef } = body

    const rote = await prisma.rote.update({
      where: { id: params.id },
      data: {
        name,
        tradition,
        description,
        spheres,
        level,
        pageRef: pageRef || null,
      },
    })

    return NextResponse.json(rote)
  } catch (error) {
    console.error('Error updating rote:', error)
    return NextResponse.json(
      { error: 'Failed to update rote' },
      { status: 500 }
    )
  }
}

// DELETE /api/rotes/[id] - Delete a rote
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
