'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { getMoodEmoji } from '@/lib/utils'

const AnalyticsDashboard = ({ entries }) => {
  const moodData = entries.reduce((acc, entry) => {
    const date = new Date(entry.createdAt).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = {
        date,
        entries: [],
        totalScore: 0,
        count: 0
      }
    }
    acc[date].entries.push(entry)
    acc[date].totalScore += (entry.analysis?.sentimentScore || 0)
    acc[date].count += 1
    return acc
  }, {})

  const chartData = Object.values(moodData).map(day => ({
    date: day.date,
    score: Math.round((day.totalScore / day.count) * 10) / 10,
    color: day.entries[0].analysis?.color || '#94a3b8',
    mood: day.entries[0].analysis?.mood || 'NEUTRAL',
    entriesCount: day.count
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const totalEntries = entries.length
  const averageSentiment = Math.round(
    entries.reduce((acc, entry) => acc + (entry.analysis?.sentimentScore || 0), 0) / totalEntries
  )
  const mostCommonMood = Object.entries(
    entries.reduce((acc, entry) => {
      const mood = entry.analysis?.mood || 'NEUTRAL'
      acc[mood] = (acc[mood] || 0) + 1
      return acc
    }, {})
  ).sort((a, b) => b[1] - a[1])[0]

  const averageWordsPerEntry = entries.reduce((acc, entry) =>
    acc + (entry.content?.split(/\s+/).length || 0), 0) / totalEntries

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Entries"
          value={totalEntries}
          icon="📝"
        />
        <StatCard
          title="Average Sentiment"
          value={`${averageSentiment.toFixed(1)}/10`}
          icon={getMoodEmoji(averageSentiment)}
        />
        <StatCard
          title="Most Common Mood"
          value={mostCommonMood?.[0] || 'N/A'}
          icon="🎯"
        />
        <StatCard
          title="Avg. Words per Entry"
          value={Math.round(averageWordsPerEntry)}
          icon="📊"
        />
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-medium tracking-tight">Mood Trend</CardTitle>
          <Badge variant="secondary" className="text-xs font-medium">
            Last {chartData.length} days
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs text-muted-foreground"
                  dy={15}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                />
                <YAxis
                  domain={[-10, 10]}
                  className="text-xs text-muted-foreground"
                  dx={-15}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  strokeWidth={2}
                  dot={(props) => {
                    const count = props.payload.entriesCount
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={count > 1 ? 5 : 4}
                        fill="hsl(var(--primary))"
                        strokeWidth={count > 1 ? 2 : 0}
                        stroke="hsl(var(--background))"
                      />
                    )
                  }}
                  activeDot={{
                    r: 6,
                    className: 'fill-primary'
                  }}
                  className="stroke-primary fill-primary/20"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <Card className="border-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: data.color }}
          />
          <CardTitle className="text-sm font-medium">
            {data.mood.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {new Date(label).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Score:</span>
            <span className="text-xs font-medium">{data.score}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Entries:</span>
            <span className="text-xs font-medium">{data.entriesCount}</span>
          </div>
        </CardContent>
      </Card>
    )
  }
  return null
}

const StatCard = ({ title, value, icon }) => (
  <Card className="bg-card/80 backdrop-blur-sm border-none">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <span className="text-2xl">{icon}</span>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
)

export default AnalyticsDashboard 