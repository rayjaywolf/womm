import NewEntryCard from '@/components/NewEntryCard'
import EntryCard from '@/components/EntryCard'
import { getUserByClerkID } from '@/util/auth'
import { prisma } from '@/util/db'
import Link from 'next/link'
import { analyze } from '@/util/ai'
import { Card } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'

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
      analysis: true,
    },
  })

  return data
}

const JournalPage = async () => {
  const data = await getEntries()
  return (
    <>
      <Card className="p-6 bg-card/80 backdrop-blur-xl border-none shadow-sm h-[calc(100vh-108px)]">
        <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </Card>
      <Toaster position="bottom-right" />
    </>
  )
}

export default JournalPage
