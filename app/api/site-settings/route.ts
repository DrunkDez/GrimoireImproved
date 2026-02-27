import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/site-settings - Get all site settings
export async function GET() {
  try {
    // Find the record with key 'main' specifically
    const settings = await prisma.siteSettings.findUnique({
      where: { key: 'main' }
    })
    
    if (!settings) {
      return NextResponse.json({
        footerText: "The Paradox Wheel © 2026",
        welcomeTitle: "Welcome, Newly Awakened",
        welcomeText: "",
        aboutPage: "",
        howToUse: "",
        creditsPage: "",
      })
    }

    return NextResponse.json({
      footerText: settings.footerText || "The Paradox Wheel © 2026",
      welcomeTitle: settings.welcomeTitle || "Welcome, Newly Awakened",
      welcomeText: settings.welcomeText || "",
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
    
    console.log('Updating site settings with data:', data) // Debug log
    
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

    console.log('Settings updated successfully:', settings) // Debug log

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    )
  }
}
