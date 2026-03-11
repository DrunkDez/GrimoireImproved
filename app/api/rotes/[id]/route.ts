import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/rotes/[id] - Get a single rote
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const rote = await prisma.rote.findUnique({
      where: { id: params.id },
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

// PUT /api/rotes/[id] - Update a rote (only owner or admin)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const params = await context.params
    
    // Check if rote exists and get owner
    const existingRote = await prisma.rote.findUnique({
      where: { id: params.id },
      include: {
        user: true
      }
    })

    if (!existingRote) {
      return NextResponse.json({ error: 'Rote not found' }, { status: 404 })
    }

    // Check permissions: must be owner or admin
    const isOwner = session?.user?.id === existingRote.userId
    const isAdmin = session?.user?.id && await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    }).then(u => u?.isAdmin)

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only edit your own rotes' },
        { status: 403 }
      )
    }

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

    return NextResponse.json(rote)
  } catch (error) {
    console.error('Error updating rote:', error)
    return NextResponse.json(
      { error: 'Failed to update rote' },
      { status: 500 }
    )
  }
}

// DELETE /api/rotes/[id] - Delete a rote (only owner or admin)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const params = await context.params
    
    // Check if rote exists and get owner
    const existingRote = await prisma.rote.findUnique({
      where: { id: params.id },
      include: {
        user: true
      }
    })

    if (!existingRote) {
      return NextResponse.json({ error: 'Rote not found' }, { status: 404 })
    }

    // Check permissions: must be owner or admin
    const isOwner = session?.user?.id === existingRote.userId
    const isAdmin = session?.user?.id && await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    }).then(u => u?.isAdmin)

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete your own rotes' },
        { status: 403 }
      )
    }

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
