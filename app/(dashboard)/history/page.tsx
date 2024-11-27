import { getUserByClerkID } from '@/util/auth'
import { prisma } from '@/util/db'
import HistoryChart from '@/components/HistoryChart'

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
    <div className="px-6 py-5">
      <div className="grid gap-4">
        <HistoryChart data={analysis} avg={avg} />
      </div>
    </div>
  )
}

export default History
