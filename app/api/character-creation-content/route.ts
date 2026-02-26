import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET - Fetch character creation content
export async function GET() {
  try {
    const content = await prisma.characterCreationContent.findFirst({
      where: { key: 'main' }
    })
    
    if (!content) {
      return NextResponse.json({
        overview: "",
        attributes: "",
        abilities: "",
        spheres: "",
        finishing: "",
      })
    }

    return NextResponse.json({
      overview: content.overview || "",
      attributes: content.attributes || "",
      abilities: content.abilities || "",
      spheres: content.spheres || "",
      finishing: content.finishing || "",
    })
  } catch (error) {
    console.error("Error fetching character creation content:", error)
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    )
  }
}

// PUT - Update character creation content
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    const content = await prisma.characterCreationContent.upsert({
      where: { key: 'main' },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        key: 'main',
        ...data,
      },
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error("Error updating character creation content:", error)
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    )
  }
}