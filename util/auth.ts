import { auth } from '@clerk/nextjs'
import { prisma } from './db'
import { redirect } from 'next/navigation'

export const getUserByClerkID = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-up')
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  })

  if (!user) {
    redirect('/new-user')
  }

  return user
}