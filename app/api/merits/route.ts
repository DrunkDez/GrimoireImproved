import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const merits = await prisma.merit.findMany({
      orderBy: [
        { category: 'asc' },
        { type: 'asc' },
        { name: 'asc' }
      ]
    })
    return NextResponse.json(merits)
  } catch (error) {
    console.error("Error fetching merits:", error)
    return NextResponse.json(
      { error: "Failed to fetch merits" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, type, subtype, cost, description, pageRef } = body

    if (!name || !category || !type || cost === undefined || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate that backgrounds have a subtype
    if (type === "background" && !subtype) {
      return NextResponse.json(
        { error: "Background type requires a subtype (general or mage)" },
        { status: 400 }
      )
    }

    const merit = await prisma.merit.create({
      data: {
        name,
        category,
        type,
        subtype: subtype || null,
        cost: parseInt(cost),
        description,
        pageRef: pageRef || null,
      },
    })

    return NextResponse.json(merit, { status: 201 })
  } catch (error) {
    console.error("Error creating merit:", error)
    return NextResponse.json(
      { error: "Failed to create merit" },
      { status: 500 }
    )
  }
}
