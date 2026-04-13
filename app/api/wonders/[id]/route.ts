import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/wonders/[id] - Get single wonder
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const wonder = await prisma.wonder.findUnique({
      where: { id },
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

    if (!wonder) {
      return NextResponse.json(
        { error: 'Wonder not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(wonder)
  } catch (error) {
    console.error('Error fetching wonder:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wonder' },
      { status: 500 }
    )
  }
}

// PUT /api/wonders/[id] - Update wonder
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check ownership or admin
    const existingWonder = await prisma.wonder.findUnique({
      where: { id }
    })

    if (!existingWonder) {
      return NextResponse.json(
        { error: 'Wonder not found' },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    const isOwner = existingWonder.userId === session.user.id
    const isAdmin = user?.isAdmin === true

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You can only edit your own wonders' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { 
      name, 
      category, 
      description, 
      backgroundCost,
      arete,
      quintessence,
      spheres, 
      pageRef 
    } = body

    // Validate category if provided
    if (category) {
      const validCategories = [
        'Artifact/Invention',
        'Charm/Gadget',
        'Talisman/Device',
        'Fetish',
        'Grimoire/Principia',
        'Primer',
        'Periapt/Matrix'
      ]
      
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Validate arete if provided
    if (arete !== null && arete !== undefined) {
      if (typeof arete !== 'number' || arete < 1 || arete > 10) {
        return NextResponse.json(
          { error: 'Arete must be a number between 1 and 10' },
          { status: 400 }
        )
      }
    }

    // Validate quintessence if provided
    if (quintessence !== null && quintessence !== undefined) {
      if (typeof quintessence !== 'number' || quintessence < 0) {
        return NextResponse.json(
          { error: 'Quintessence must be a non-negative number' },
          { status: 400 }
        )
      }
    }

    const wonder = await prisma.wonder.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(description && { description }),
        ...(backgroundCost !== undefined && { backgroundCost }),
        ...(arete !== undefined && { arete }),
        ...(quintessence !== undefined && { quintessence }),
        ...(spheres !== undefined && { spheres }),
        ...(pageRef !== undefined && { pageRef }),
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

    return NextResponse.json(wonder)
  } catch (error) {
    console.error('Error updating wonder:', error)
    return NextResponse.json(
      { error: 'Failed to update wonder' },
      { status: 500 }
    )
  }
}

// DELETE /api/wonders/[id] - Delete wonder
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check ownership or admin
    const existingWonder = await prisma.wonder.findUnique({
      where: { id }
    })

    if (!existingWonder) {
      return NextResponse.json(
        { error: 'Wonder not found' },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    const isOwner = existingWonder.userId === session.user.id
    const isAdmin = user?.isAdmin === true

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own wonders' },
        { status: 403 }
      )
    }

    await prisma.wonder.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Wonder deleted successfully' })
  } catch (error) {
    console.error('Error deleting wonder:', error)
    return NextResponse.json(
      { error: 'Failed to delete wonder' },
      { status: 500 }
    )
  }
}
