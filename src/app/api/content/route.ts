import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: List all content, or filter by section
export async function GET(request: NextRequest) {
  try {
    const section = request.nextUrl.searchParams.get('section')

    const where = section ? { section } : {}

    const content = await db.siteContent.findMany({
      where,
      orderBy: [{ section: 'asc' }, { key: 'asc' }],
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Failed to fetch content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

// POST: Create or update content (upsert by section+key)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, key, value } = body

    if (!section || !key || value === undefined) {
      return NextResponse.json(
        { error: 'section, key, and value are required' },
        { status: 400 }
      )
    }

    const content = await db.siteContent.upsert({
      where: { section_key: { section, key } },
      update: { value },
      create: { section, key, value },
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Failed to upsert content:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}

// PUT: Update content by id
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, section, key, value } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.siteContent.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    const content = await db.siteContent.update({
      where: { id },
      data: {
        ...(section !== undefined && { section }),
        ...(key !== undefined && { key }),
        ...(value !== undefined && { value }),
      },
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Failed to update content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

// DELETE: Delete content by id
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.siteContent.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    await db.siteContent.delete({ where: { id } })

    return NextResponse.json({ message: 'Content deleted successfully' })
  } catch (error) {
    console.error('Failed to delete content:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}
