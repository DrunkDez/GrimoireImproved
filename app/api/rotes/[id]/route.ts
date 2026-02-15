import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/rotes/[id] - Get a single rote
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    console.log('Deleting rote with ID:', params.id)
    
    await prisma.rote.delete({
      where: { id: params.id },
    })

    console.log('Rote deleted successfully:', params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting rote:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to delete rote', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
