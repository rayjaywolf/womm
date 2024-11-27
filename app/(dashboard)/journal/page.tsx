import NewEntryCard from '@/components/NewEntryCard'
import EntryCard from '@/components/EntryCard'
import { getUserByClerkID } from '@/util/auth'
import { prisma } from '@/util/db'
import Link from 'next/link'
import { analyze } from '@/util/ai'

const getEntries = async () => {
  const user = await getUserByClerkID()
  const data = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      analysis: true
    }
  })

  return data
}

const JournalPage = async () => {
  const data = await getEntries()
  return (
    <div className="px-6 py-5 bg-card/40 h-full">
      <div className="grid grid-cols-3 gap-4">
        <NewEntryCard />
        {data.map((entry) => (
          <div key={entry.id}>
            <Link href={`/journal/${entry.id}`}>
              <EntryCard entry={entry} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JournalPage
