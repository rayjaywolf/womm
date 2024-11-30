import { getUserByClerkID } from '@/util/auth'
import { prisma } from '@/util/db'
import YearlyMoodCalendar from '@/components/YearlyMoodCalendar'

const getData = async () => {
  const user = await getUserByClerkID()

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    include: {
      analysis: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  // Group entries by date and calculate average sentiment
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = new Date(entry.createdAt)
    date.setHours(0, 0, 0, 0)
    const dateString = date.toISOString()

    if (!acc[dateString]) {
      acc[dateString] = {
        date,
        sentimentSum: 0,
        entriesCount: 0,
      }
    }

    if (entry.analysis?.sentimentScore) {
      acc[dateString].sentimentSum += entry.analysis.sentimentScore
      acc[dateString].entriesCount += 1
    }

    return acc
  }, {})

  // Calculate averages and format data
  const calendarData = Object.values(entriesByDate).map(({ date, sentimentSum, entriesCount }) => ({
    date,
    averageSentiment: entriesCount > 0 ? sentimentSum / entriesCount : 0,
    entriesCount,
  }))

  return calendarData
}

const HistoryPage = async () => {
  const data = await getData()

  return <YearlyMoodCalendar data={data} />
}

export default HistoryPage