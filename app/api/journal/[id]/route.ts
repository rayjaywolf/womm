import { analyze } from '@/util/ai'
import { getUserByClerkID } from '@/util/auth'
import { prisma } from '@/util/db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const PATCH = async (request: Request, { params }) => {
  const { content } = await request.json()
  const user = await getUserByClerkID()
  const updateEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
    data: {
      content,
    },
  })

  const analysis = await analyze(updateEntry.content)

  const updated = await prisma.analysis.upsert({
    where: {
      entryId: updateEntry.id,
    },
    create: {
      userId: user.id,
      entryId: updateEntry.id,
      ...analysis,
    },
    update: analysis,
  })

  return NextResponse.json({ data: { ...updateEntry, analysis: updated } })
}

export const DELETE = async (request: Request, { params }) => {
  const user = await getUserByClerkID()

  const deletedEntry = await prisma.journalEntry.delete({
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
  })

  revalidatePath('/journal')
  return NextResponse.json({ data: deletedEntry })
}
