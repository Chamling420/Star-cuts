import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: List gallery images
export async function GET() {
  try {
    const images = await db.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}

// POST: Create gallery image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, image, category, beforeImage, description } = body

    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      )
    }

    const galleryImage = await db.galleryImage.create({
      data: {
        title,
        image,
        category: category || 'general',
        beforeImage: beforeImage || null,
        description: description || null,
      },
    })

    return NextResponse.json({ image: galleryImage }, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to create gallery image' },
      { status: 500 }
    )
  }
}

// PUT: Update gallery image
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, image, category, beforeImage, description, active } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.galleryImage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 })
    }

    const updated = await db.galleryImage.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(image !== undefined && { image }),
        ...(category !== undefined && { category }),
        ...(beforeImage !== undefined && { beforeImage }),
        ...(description !== undefined && { description }),
        ...(active !== undefined && { active }),
      },
    })

    return NextResponse.json({ image: updated })
  } catch (error) {
    console.error('Error updating gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery image' },
      { status: 500 }
    )
  }
}

// DELETE: Delete gallery image
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.galleryImage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 })
    }

    await db.galleryImage.delete({ where: { id } })

    return NextResponse.json({ message: 'Gallery image deleted successfully' })
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery image' },
      { status: 500 }
    )
  }
}
