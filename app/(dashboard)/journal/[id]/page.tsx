import Editor from '@/components/Editor'
import { getUserByClerkID } from '@/util/auth'
import { prisma } from '@/util/db'

const getEntry = async (id) => {
  const user = await getUserByClerkID()
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  })

  return entry
}

const JournalEditorPage = async ({ params }) => {
  const entry = await getEntry(params.id)

  return (
    <div className="h-full w-full max-w-[1200px] mx-auto">
      <Editor entry={entry} />
    </div>
  )
}

export default JournalEditorPage
