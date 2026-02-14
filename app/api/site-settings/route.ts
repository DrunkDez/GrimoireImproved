import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/site-settings - Get all site settings
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.siteSettings.findMany()
    
    // Convert to key-value object for easier use
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)
    
    return NextResponse.json(settingsObj)
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    )
  }
}

// PUT /api/site-settings - Update site settings (bulk)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updates = body.settings as Record<string, string>
    
    // Update or create each setting
    for (const [key, value] of Object.entries(updates)) {
      await prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    )
  }
}
