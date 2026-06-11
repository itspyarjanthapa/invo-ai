import { prisma } from '@/lib/prisma'
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  }
  
  // Get the full user data from Clerk
  const userFromClerk = await currentUser()
  
  if (!userFromClerk) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  const email = userFromClerk.emailAddresses[0]?.emailAddress || ''
  const name = `${userFromClerk.firstName || ''} ${userFromClerk.lastName || ''}`.trim()
  
  // Save user to your database
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email: email,
      name: name || null,
    },
    create: {
      clerkId: userId,
      email: email,
      name: name || null,
    }
  })
  
  console.log('✅ User saved to database:', user)
  
  return NextResponse.json({ success: true, user })
}