// app/api/site-updates/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/site-updates - Get published site updates (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const latest = searchParams.get('latest') === 'true'

    const updates = await prisma.siteUpdate.findMany({
      where: { published: true },
      orderBy: [
        { priority: 'desc' },
        { date: 'desc' },
      ],
      take: latest ? 1 : limit,
    })

    if (latest && updates.length > 0) {
      return NextResponse.json(updates[0])
    }

    return NextResponse.json(updates)
  } catch (error) {
    console.error('Error fetching site updates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site updates' },
      { status: 500 }
    )
  }
}