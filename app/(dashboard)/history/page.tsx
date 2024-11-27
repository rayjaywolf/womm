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
  console.log(avg, analysis)
  return (
    <div className="h-full w-full">
      <div>Average Sentiment: {avg} </div>
      <div className="h-full w-full">
        <HistoryChart data={analysis} />
      </div>
    </div>
  )
}

export default History
