import { NextResponse } from 'next/server'
import { auth } from "@/auth";
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
      select: {
        renderCount: true,
        flwSubscriptionId: true // or whatever field indicates subscription
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      renderCount: user.renderCount || 0,
      isSubscribed: !!user.flwSubscriptionId
    })
  } catch (error) {
    console.error('Error fetching user render status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
