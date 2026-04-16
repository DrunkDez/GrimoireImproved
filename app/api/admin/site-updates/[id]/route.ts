import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Helper to get params (Next.js 15+)
async function getParams(request: NextRequest, context: any) {
  const params = await context.params
  return params
}

// GET /api/admin/site-updates/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const id = params.id

    const update = await prisma.siteUpdate.findUnique({
      where: { id },
    })

    if (!update) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 })
    }

    return NextResponse.json(update)
  } catch (error) {
    console.error('Error fetching site update:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site update' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/site-updates/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const id = params.id

    const body = await request.json()
    const { title, description, category, published, priority, date } = body

    // Validate category if provided
    if (category) {
      const validCategories = ['Feature', 'Bug Fix', 'Content', 'Improvement', 'Announcement']
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
          { status: 400 }
        )
      }
    }

    const update = await prisma.siteUpdate.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(category !== undefined && { category }),
        ...(published !== undefined && { published }),
        ...(priority !== undefined && { priority }),
        ...(date !== undefined && { date: new Date(date) }),
      },
    })

    return NextResponse.json(update)
  } catch (error) {
    console.error('Error updating site update:', error)
    return NextResponse.json(
      { error: 'Failed to update site update' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/site-updates/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const id = params.id

    await prisma.siteUpdate.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting site update:', error)
    return NextResponse.json(
      { error: 'Failed to delete site update' },
      { status: 500 }
    )
  }
}
