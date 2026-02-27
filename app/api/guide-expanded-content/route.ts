import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET - Fetch guide expanded content
export async function GET() {
  try {
    const content = await prisma.guideExpandedContent.findFirst({
      where: { key: 'main' }
    })
    
    if (!content) {
      return NextResponse.json({
        concept: "",
        attributes: "",
        abilities: "",
        spheres: "",
        backgrounds: "",
        freebies: "",
      })
    }

    return NextResponse.json({
      concept: content.concept || "",
      attributes: content.attributes || "",
      abilities: content.abilities || "",
      spheres: content.spheres || "",
      backgrounds: content.backgrounds || "",
      freebies: content.freebies || "",
    })
  } catch (error) {
    console.error("Error fetching guide expanded content:", error)
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    )
  }
}

// PUT - Update guide expanded content
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    const content = await prisma.guideExpandedContent.upsert({
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
    console.error("Error updating guide expanded content:", error)
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    )
  }
}
