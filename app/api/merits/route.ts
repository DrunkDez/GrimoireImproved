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
    const { name, category, type, cost, description, pageRef } = body

    if (!name || !category || !type || cost === undefined || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const merit = await prisma.merit.create({
      data: {
        name,
        category,
        type,
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
