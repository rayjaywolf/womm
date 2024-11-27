import { getUserByClerkID } from '@/util/auth'
import { prisma } from '@/util/db'
import HistoryChart from '@/components/HistoryChart'
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
  })

  const sum = analysis.reduce((all, current) => all + current.sentimentScore, 0)
  const avg = Math.round(sum / analysis.length)
  return { analysis, avg }
}

const History = async () => {
  const { avg, analysis } = await getData()
  
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-xl border-none shadow-sm">
      <div className="grid gap-4">
        <HistoryChart data={analysis} avg={avg} />
      </div>
    </Card>
  )
}

export default History
