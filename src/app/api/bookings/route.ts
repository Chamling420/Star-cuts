import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/bookings - List bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const where: any = {}
    if (userId) where.userId = userId
    if (status) where.status = status

    const bookings = await db.booking.findMany({
      where,
      include: {
        service: true,
        user: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

// POST /api/bookings - Create a booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, serviceId, date, time, notes } = body

    if (!userId || !serviceId || !date || !time) {
      return NextResponse.json(
        { error: 'User, service, date, and time are required' },
        { status: 400 }
      )
    }

    // Check for conflicting booking
    const existing = await db.booking.findFirst({
      where: {
        serviceId,
        date,
        time,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please choose a different time.' },
        { status: 409 }
      )
    }

    const booking = await db.booking.create({
      data: {
        userId,
        serviceId,
        date,
        time,
        notes: notes || null,
        status: 'PENDING',
      },
      include: {
        service: true,
        user: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

// PUT /api/bookings - Update a booking (status change)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    const data: any = {}
    if (status) data.status = status
    if (notes !== undefined) data.notes = notes

    const booking = await db.booking.update({
      where: { id },
      data,
      include: {
        service: true,
        user: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

// DELETE /api/bookings - Delete a booking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    await db.booking.delete({ where: { id } })

    return NextResponse.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    console.error('Delete booking error:', error)
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
