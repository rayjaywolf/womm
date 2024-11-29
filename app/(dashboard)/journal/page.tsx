import NewEntryCard from '@/components/NewEntryCard'
import EntryCard from '@/components/EntryCard'
import { getUserByClerkID } from '@/util/auth'
import { prisma } from '@/util/db'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'
import JournalFilters from '@/components/JournalFilters'
import { startOfToday, subDays, subMonths, startOfDay } from 'date-fns'

const getEntries = async (filter = 'all', sort = 'latest') => {
  const user = await getUserByClerkID()
  let whereClause: any = {
    userId: user.id,
  }

  if (filter !== 'all') {
    let date = new Date()
    switch (filter) {
      case 'today':
        date = startOfToday()
        break
      case 'week':
        date = subDays(new Date(), 7)
        break
      case 'month':
        date = subMonths(new Date(), 1)
        break
    }
    whereClause.createdAt = {
      gte: startOfDay(date),
    }
  }

  const data = await prisma.journalEntry.findMany({
    where: whereClause,
    orderBy: {
      createdAt: sort === 'latest' ? 'desc' : 'asc',
    },
    include: {
      analysis: true,
    },
  })

  return data
}

interface PageProps {
  searchParams: { [key: string]: string | undefined }
}

const JournalPage = async ({ searchParams }: PageProps) => {
  const filter = searchParams.filter || 'all'
  const sort = searchParams.sort || 'latest'
  const data = await getEntries(filter, sort)

  return (
    <>
      <Card className="p-6 bg-card/80 backdrop-blur-xl border-none shadow-sm h-[calc(100vh-108px)]">
        <div className="h-full overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
          <JournalFilters filter={filter} sort={sort} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            <NewEntryCard />
            {data.map((entry) => (
              <div key={entry.id} className="relative">
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
