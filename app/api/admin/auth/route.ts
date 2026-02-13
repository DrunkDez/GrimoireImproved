import { NextRequest, NextResponse } from 'next/server'

// Use environment variable with fallback
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TruthUntilParadox'

// POST /api/admin/auth - Verify admin password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ authenticated: true })
    }

    return NextResponse.json(
      { authenticated: false, error: 'Invalid password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error authenticating:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
