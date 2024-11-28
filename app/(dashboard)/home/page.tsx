import { getUserByClerkID } from '@/util/auth'
import { prisma } from '@/util/db'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import { Card } from '@/components/ui/card'

const getAnalyticsData = async () => {
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

  return entries
}

const HomePage = async () => {
  const entries = await getAnalyticsData()
  
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-xl border-none shadow-sm h-[calc(100vh-108px)]">
      <AnalyticsDashboard entries={entries} />
    </Card>
  )
}

export default HomePage 