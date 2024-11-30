import { getUserByClerkID } from '@/util/auth'
import { prisma } from '@/util/db'
import HistoryChart from '@/components/HistoryChart'
import MoodPieChart from '@/components/MoodPieChart'
import { Card } from "@/components/ui/card"

const getData = async () => {
  const user = await getUserByClerkID()
  const analysis = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      sentimentScore: true,
      mood: true,
      updatedAt: true,
      color: true
    }
  })

  const sum = analysis.reduce((all, current) => all + current.sentimentScore, 0)
  const avg = Math.round(sum / analysis.length)
  return { analysis, avg }
}

const Statistics = async () => {
  const { avg, analysis } = await getData()

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-xl border-none shadow-sm h-[calc(100vh-108px)]">
      <div className="h-full overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
        <div className="grid gap-14">
          <HistoryChart data={analysis} avg={avg} />
          <MoodPieChart data={analysis} />
        </div>
      </div>
    </Card>
  )
}

export default Statistics
