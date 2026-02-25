import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/site-settings - Get all site settings
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst()
    
    if (!settings) {
      return NextResponse.json({
        footerText: "The Paradox Wheel © 2026",
        aboutPage: "",
        howToUse: "",
        creditsPage: "",
      })
    }

    return NextResponse.json({
      footerText: settings.footerText || "The Paradox Wheel © 2026",
      aboutPage: settings.aboutPage || "",
      howToUse: settings.howToUse || "",
      creditsPage: settings.creditsPage || "",
    })
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    )
  }
}

// PUT /api/site-settings - Update site settings (bulk)
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    const settings = await prisma.siteSettings.upsert({
      where: { key: 'main' },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        key: 'main',
        value: '',
        ...data,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    )
  }
}
