// app/api/admin/book-releases/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PUT /api/admin/book-releases/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      publisher,
      description,
      releaseDate,
      status,
      coverImageUrl,
      purchaseUrl,
      announcementUrl,
      published,
      priority
    } = body

    // Validate status if provided
    if (status) {
      const validStatuses = ['Announced', 'Pre-order', 'Released', 'Delayed']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        )
      }
    }

    const release = await prisma.bookRelease.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(publisher !== undefined && { publisher: publisher?.trim() || null }),
        ...(description !== undefined && { description: description.trim() }),
        ...(releaseDate !== undefined && { releaseDate: releaseDate ? new Date(releaseDate) : null }),
        ...(status !== undefined && { status }),
        ...(coverImageUrl !== undefined && { coverImageUrl: coverImageUrl?.trim() || null }),
        ...(purchaseUrl !== undefined && { purchaseUrl: purchaseUrl?.trim() || null }),
        ...(announcementUrl !== undefined && { announcementUrl: announcementUrl?.trim() || null }),
        ...(published !== undefined && { published }),
        ...(priority !== undefined && { priority }),
      },
    })

    return NextResponse.json(release)
  } catch (error) {
    console.error('Error updating book release:', error)
    return NextResponse.json(
      { error: 'Failed to update book release' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/book-releases/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.bookRelease.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting book release:', error)
    return NextResponse.json(
      { error: 'Failed to delete book release' },
      { status: 500 }
    )
  }
}