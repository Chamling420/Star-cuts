import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: List payment methods, optionally filter by ?type=bank or ?active=true
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const active = searchParams.get('active')

    const where: Record<string, unknown> = {}

    if (type) {
      where.type = type
    }

    if (active === 'true') {
      where.active = true
    } else if (active === 'false') {
      where.active = false
    }

    const paymentMethods = await db.paymentMethod.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ paymentMethods })
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    )
  }
}

// POST: Create a new payment method
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      accountHolderName,
      bankName,
      branchName,
      accountNumber,
      fullName,
      number,
      qrImage,
      active,
    } = body

    if (!type) {
      return NextResponse.json(
        { error: 'type is required' },
        { status: 400 }
      )
    }

    const validTypes = ['bank', 'esewa', 'khalti', 'imepay']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    const paymentMethod = await db.paymentMethod.create({
      data: {
        type,
        accountHolderName: accountHolderName || null,
        bankName: bankName || null,
        branchName: branchName || null,
        accountNumber: accountNumber || null,
        fullName: fullName || null,
        number: number || null,
        qrImage: qrImage || null,
        active: active !== undefined ? active : true,
      },
    })

    return NextResponse.json({ paymentMethod }, { status: 201 })
  } catch (error) {
    console.error('Error creating payment method:', error)
    return NextResponse.json(
      { error: 'Failed to create payment method' },
      { status: 500 }
    )
  }
}

// PUT: Update a payment method
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      type,
      accountHolderName,
      bankName,
      branchName,
      accountNumber,
      fullName,
      number,
      qrImage,
      active,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.paymentMethod.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      )
    }

    if (type !== undefined) {
      const validTypes = ['bank', 'esewa', 'khalti', 'imepay']
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: `type must be one of: ${validTypes.join(', ')}` },
          { status: 400 }
        )
      }
    }

    const paymentMethod = await db.paymentMethod.update({
      where: { id },
      data: {
        ...(type !== undefined && { type }),
        ...(accountHolderName !== undefined && { accountHolderName }),
        ...(bankName !== undefined && { bankName }),
        ...(branchName !== undefined && { branchName }),
        ...(accountNumber !== undefined && { accountNumber }),
        ...(fullName !== undefined && { fullName }),
        ...(number !== undefined && { number }),
        ...(qrImage !== undefined && { qrImage }),
        ...(active !== undefined && { active }),
      },
    })

    return NextResponse.json({ paymentMethod })
  } catch (error) {
    console.error('Error updating payment method:', error)
    return NextResponse.json(
      { error: 'Failed to update payment method' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a payment method
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.paymentMethod.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      )
    }

    await db.paymentMethod.delete({ where: { id } })

    return NextResponse.json({ message: 'Payment method deleted successfully' })
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    )
  }
}
