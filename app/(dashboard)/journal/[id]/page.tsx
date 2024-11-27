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
  })

  return entry
}

const JournalEditorPage = async ({ params }) => {
  const entry = await getEntry(params.id)
  return (
    <div>
      <Editor entry={entry} />
    </div>
  )
}

export default JournalEditorPage
