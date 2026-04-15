// app/api/book-releases/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/book-releases - Get published book releases (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') // Filter by status

    const where: any = { published: true }
    if (status) {
      where.status = status
    }

    const releases = await prisma.bookRelease.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { releaseDate: 'asc' },
      ],
      take: limit,
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