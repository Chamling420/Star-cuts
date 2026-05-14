import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/messages - List all messages
export async function GET(request: NextRequest) {
  try {
    const messages = await db.message.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST /api/messages - Create a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const msg = await db.message.create({
      data: { name, email, message },
    })

    return NextResponse.json({ message: 'Message sent successfully', data: msg }, { status: 201 })
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

// PUT /api/messages - Mark as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, read } = body

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    const msg = await db.message.update({
      where: { id },
      data: { read: read !== undefined ? read : true },
    })

    return NextResponse.json({ message: msg })
  } catch (error) {
    console.error('Update message error:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

// DELETE /api/messages - Delete a message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    await db.message.delete({ where: { id } })

    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
