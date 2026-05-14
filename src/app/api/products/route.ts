import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: List products
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

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST: Create product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, category, brand, image, featured, inStock } = body

    if (!title || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Title, description, and price are required' },
        { status: 400 }
      )
    }

    const product = await db.product.create({
      data: {
        title,
        description,
        price: parseFloat(String(price)),
        category: category || 'hair',
        brand: brand || null,
        image: image || null,
        featured: featured || false,
        inStock: inStock !== undefined ? inStock : true,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT: Update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, price, category, brand, image, featured, inStock } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = await db.product.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(String(price)) }),
        ...(category !== undefined && { category }),
        ...(brand !== undefined && { brand }),
        ...(image !== undefined && { image }),
        ...(featured !== undefined && { featured }),
        ...(inStock !== undefined && { inStock }),
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE: Delete product
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await db.product.delete({ where: { id } })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
