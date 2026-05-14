import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: List services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')

    const where: Record<string, unknown> = {}

    if (featured === 'true') {
      where.featured = true
    }

    if (category) {
      where.category = category
    }

    const services = await db.service.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST: Create service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, category, duration, image, featured } = body

    if (!title || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Title, description, and price are required' },
        { status: 400 }
      )
    }

    const service = await db.service.create({
      data: {
        title,
        description,
        price: parseFloat(String(price)),
        category: category || 'hair',
        duration: duration || 60,
        image: image || null,
        featured: featured || false,
      },
    })

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}

// PUT: Update service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, price, category, duration, image, featured, active } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.service.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    const service = await db.service.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(String(price)) }),
        ...(category !== undefined && { category }),
        ...(duration !== undefined && { duration: parseInt(String(duration)) }),
        ...(image !== undefined && { image }),
        ...(featured !== undefined && { featured }),
        ...(active !== undefined && { active }),
      },
    })

    return NextResponse.json({ service })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE: Delete service
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.service.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    await db.service.delete({ where: { id } })

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
