// app/api/admin/site-updates/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/admin/site-updates - Get all site updates (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await prisma.siteUpdate.findMany({
      orderBy: [
        { priority: 'desc' },
        { date: 'desc' },
      ],
    })

    return NextResponse.json(updates)
  } catch (error) {
    console.error('Error fetching site updates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site updates' },
      { status: 500 }
    )
  }
}

// POST /api/admin/site-updates - Create new site update (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, published, priority, date } = body

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['Feature', 'Bug Fix', 'Content', 'Improvement', 'Announcement']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    const update = await prisma.siteUpdate.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        published: published ?? false,
        priority: priority ?? 0,
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(update)
  } catch (error) {
    console.error('Error creating site update:', error)
    return NextResponse.json(
      { error: 'Failed to create site update' },
      { status: 500 }
    )
  }
}