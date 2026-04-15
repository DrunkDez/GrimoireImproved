// app/api/admin/book-releases/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/admin/book-releases - Get all book releases (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const releases = await prisma.bookRelease.findMany({
      orderBy: [
        { priority: 'desc' },
        { releaseDate: 'asc' },
      ],
    })

    return NextResponse.json(releases)
  } catch (error) {
    console.error('Error fetching book releases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch book releases' },
      { status: 500 }
    )
  }
}

// POST /api/admin/book-releases - Create new book release (admin only)
export async function POST(request: NextRequest) {
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

    if (!title || !description || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, status' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['Announced', 'Pre-order', 'Released', 'Delayed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const release = await prisma.bookRelease.create({
      data: {
        title: title.trim(),
        publisher: publisher?.trim() || null,
        description: description.trim(),
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        status,
        coverImageUrl: coverImageUrl?.trim() || null,
        purchaseUrl: purchaseUrl?.trim() || null,
        announcementUrl: announcementUrl?.trim() || null,
        published: published ?? false,
        priority: priority ?? 0,
      },
    })

    return NextResponse.json(release)
  } catch (error) {
    console.error('Error creating book release:', error)
    return NextResponse.json(
      { error: 'Failed to create book release' },
      { status: 500 }
    )
  }
}