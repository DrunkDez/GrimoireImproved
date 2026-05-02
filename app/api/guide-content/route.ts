import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// ── GET /api/guide-content?step=<stepId> ─────────────────────────────────────
// Public — called by the character creation wizard on each step.
// Returns { guidanceText: string } if a CMS override exists, or 204 if not
// (wizard falls back to hardcoded defaults on 204).
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const step = searchParams.get("step")

    if (!step) {
      return NextResponse.json({ error: "Missing step parameter" }, { status: 400 })
    }

    const record = await prisma.guideContent.findUnique({
      where: { stepId: step },
    })

    if (!record || !record.guidanceText) {
      // No override — wizard will use its hardcoded fallback
      return new NextResponse(null, { status: 204 })
    }

    return NextResponse.json({
      stepId:       record.stepId,
      guidanceText: record.guidanceText,
      updatedAt:    record.updatedAt,
    })
  } catch (error) {
    console.error("Error fetching guide content:", error)
    return NextResponse.json({ error: "Failed to fetch guide content" }, { status: 500 })
  }
}

// ── PUT /api/guide-content ────────────────────────────────────────────────────
// Admin only — upserts guidance text for one or more steps at once.
// Body: { updates: Array<{ stepId: string; guidanceText: string }> }
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { updates } = body as { updates: Array<{ stepId: string; guidanceText: string }> }

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "Missing updates array" }, { status: 400 })
    }

    // Upsert each step — creates if missing, updates if exists
    const results = await Promise.all(
      updates.map(({ stepId, guidanceText }) =>
        prisma.guideContent.upsert({
          where:  { stepId },
          update: { guidanceText, updatedAt: new Date() },
          create: { stepId, guidanceText },
        })
      )
    )

    return NextResponse.json({ saved: results.length, records: results })
  } catch (error) {
    console.error("Error saving guide content:", error)
    return NextResponse.json({ error: "Failed to save guide content" }, { status: 500 })
  }
}

// ── DELETE /api/guide-content?step=<stepId> ───────────────────────────────────
// Admin only — clears a CMS override, returning wizard to its hardcoded fallback.
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const step = searchParams.get("step")

    if (!step) {
      return NextResponse.json({ error: "Missing step parameter" }, { status: 400 })
    }

    await prisma.guideContent.delete({ where: { stepId: step } }).catch(() => {
      // Already gone — treat as success
    })

    return NextResponse.json({ deleted: step })
  } catch (error) {
    console.error("Error deleting guide content:", error)
    return NextResponse.json({ error: "Failed to delete guide content" }, { status: 500 })
  }
}