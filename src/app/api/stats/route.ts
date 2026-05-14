import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/stats - Dashboard statistics
export async function GET() {
  try {
    const totalBookings = await db.booking.count()
    const totalServices = await db.service.count({ where: { active: true } })
    const totalProducts = await db.product.count()
    const totalUsers = await db.user.count()
    const pendingBookings = await db.booking.count({ where: { status: 'PENDING' } })
    const totalMessages = await db.message.count()
    const unreadMessages = await db.message.count({ where: { read: false } })

    // Revenue from completed bookings
    const completedBookings = await db.booking.findMany({
      where: { status: 'COMPLETED' },
      include: { service: { select: { price: true } } },
    })
    const totalRevenue = completedBookings.reduce(
      (sum, booking) => sum + (booking.service?.price || 0),
      0
    )

    // Top services
    const topServicesRaw = await db.booking.groupBy({
      by: ['serviceId'],
      _count: { serviceId: true },
      orderBy: { _count: { serviceId: 'desc' } },
      take: 5,
    })

    const serviceIds = topServicesRaw.map((t) => t.serviceId)
    const serviceDetails = await db.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, title: true, price: true },
    })

    const topServices = topServicesRaw.map((t) => {
      const detail = serviceDetails.find((s) => s.id === t.serviceId)
      return {
        id: t.serviceId,
        title: detail?.title || 'Unknown',
        price: detail?.price || 0,
        bookingsCount: t._count.serviceId,
      }
    })

    return NextResponse.json({
      stats: {
        totalBookings,
        totalServices,
        totalProducts,
        totalUsers,
        totalRevenue,
        pendingBookings,
        totalMessages,
        unreadMessages,
      },
      topServices,
      bookingsByStatus: [
        { status: 'PENDING', count: pendingBookings },
        { status: 'CONFIRMED', count: await db.booking.count({ where: { status: 'CONFIRMED' } }) },
        { status: 'CANCELLED', count: await db.booking.count({ where: { status: 'CANCELLED' } }) },
        { status: 'COMPLETED', count: completedBookings.length },
      ],
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
