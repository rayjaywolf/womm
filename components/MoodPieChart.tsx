'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useMemo } from 'react'
import { startOfToday, subDays, subMonths, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns'
import { format } from 'date-fns'

const moodCategories = {
  happiness: {
    moods: [
      'Happy',
      'Grateful',
      'Content',
      'Joyful',
      'Optimistic',
      'Giddy',
      'Appreciative',
      'Satisfied',
      'Cheerful',
      'Victorious',
      'Silly',
      'Jubilant',
      'Trusting',
      'Eager',
      'Confident',
      'Loving',
      'Playful',
      'Motivated',
      'Enthusiastic',
      'Empowered',
      'Ambitious',
      'Bold',
      'Resilient',
      'Tender',
      'Zen',
    ],
    color: '#F9DD7E',
  },
  sadness: {
    moods: [
      'Sad',
      'Disappointed',
      'Melancholy',
      'Regretful',
      'Heartbroken',
      'Wistful',
      'Lonely',
      'Defeated',
      'Ashamed',
      'Vulnerable',
      'Guilty',
      'Insecure',
      'Detached',
      'Misunderstood',
      'Pessimistic',
      'Surly',
      'Conflicted',
    ],
    color: '#EEDAD1',
  },
  calmness: {
    moods: [
      'Relaxed',
      'Calm',
      'Peaceful',
      'Mellow',
      'Thoughtful',
      'Reflective',
      'Creative',
      'Focused',
      'Relieved',
      'Cautious',
      'Awestruck',
      'Inquisitive',
      'Curious',
      'Indifferent',
    ],
    color: '#8D9868',
  },
  anger: {
    moods: [
      'Angry',
      'Annoyed',
      'Grumpy',
      'Resentful',
      'Irritated',
      'Distrustful',
      'Disgusted',
      'Rebellious',
      'Defensive',
      'Smug',
      'Frustrated',
      'Impatient',
      'Envious',
    ],
    color: '#E1927F',
  },
  excitement: {
    moods: [
      'Excited',
      'Energized',
      'Inspired',
      'Restless',
      'Surprised',
      'Shocked',
      'Hyped',
      'Daring',
      'Passionate',
      'Bold',
      'Determined',
      'Nostalgic',
      'Eager',
      'Enthusiastic',
    ],
    color: '#7DA3DA',
  },
  stress: {
    moods: [
      'Nervous',
      'Stressed',
      'Anxious',
      'Overwhelmed',
      'Scared',
      'Jealous',
      'Scattered',
      'Hesitant',
      'Panicked',
      'Unsettled',
      'Embarrassed',
      'Suspicious',
      'Fearful',
      'Clueless',
      'Confused',
      'Tired',
      'Bored',
    ],
    color: '#A6ACDB',
  },
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="hsl(var(--foreground))"
      className="text-xs font-medium"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Card className="border-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: payload[0].payload.color }}
          />
          <CardTitle className="text-sm font-medium">
            {payload[0].name}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          {`${payload[0].value} entries (${((payload[0].value / payload[0].payload.total) * 100).toFixed(0)}%)`}
        </CardContent>
      </Card>
    )
  }
  return null
}

const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const MoodPieChart = ({ data }) => {
  const [timeFilter, setTimeFilter] = useState('all')

  const filteredData = useMemo(() => {
    if (timeFilter === 'all') return data

    let date = new Date()
    switch (timeFilter) {
      case 'today':
        date = startOfToday()
        break
      case 'week':
        date = subDays(new Date(), 7)
        break
      case 'month':
        date = subMonths(new Date(), 1)
        break
      default:
        return data
    }

    return data.filter(entry => new Date(entry.updatedAt) >= startOfDay(date))
  }, [data, timeFilter])

  const getMoodCategory = (mood) => {
    for (const [category, info] of Object.entries(moodCategories)) {
      if (info.moods.includes(mood)) {
        return category
      }
    }
    return 'unknown'
  }

  const categoryData = filteredData.reduce((acc, entry) => {
    const category = getMoodCategory(entry.mood)
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const total = Object.values(categoryData).reduce(
    (sum, value) => sum + value,
    0,
  )

  const chartData = Object.entries(categoryData)
    .filter(([name]) => name !== 'unknown')
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: moodCategories[name]?.color,
      total,
    }))

  // Enhanced time series data processing
  const timeSeriesData = useMemo(() => {
    if (!filteredData.length) return []

    const dateRange = {
      start: startOfDay(new Date(Math.min(...filteredData.map(d => new Date(d.updatedAt))))),
      end: endOfDay(new Date(Math.max(...filteredData.map(d => new Date(d.updatedAt)))))
    }

    const dates = eachDayOfInterval(dateRange)

    return dates.map(date => {
      const dayEntries = filteredData.filter(entry =>
        startOfDay(new Date(entry.updatedAt)).getTime() === startOfDay(date).getTime()
      )

      // Calculate average sentiment score for each category
      const categoryScores = Object.keys(moodCategories).reduce((acc, category) => {
        const categoryEntries = dayEntries.filter(entry =>
          getMoodCategory(entry.mood) === category
        )

        // Calculate average sentiment score for this category
        const avgScore = categoryEntries.length
          ? categoryEntries.reduce((sum, entry) => sum + entry.sentimentScore, 0) / categoryEntries.length
          : 0

        acc[`${category}Score`] = avgScore
        // Also store the count for reference
        acc[`${category}Count`] = categoryEntries.length
        return acc
      }, {})

      return {
        date: format(date, 'MMM dd'),
        totalEntries: dayEntries.length,
        avgDayScore: dayEntries.length
          ? dayEntries.reduce((sum, entry) => sum + entry.sentimentScore, 0) / dayEntries.length
          : 0,
        ...categoryScores,
      }
    })
  }, [filteredData])

  return (
    <div className="col-span-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold tracking-tight">
          Mood Categories Distribution
        </h2>
        <Select
          value={timeFilter}
          onValueChange={setTimeFilter}
        >
          <SelectTrigger className="w-[130px] focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6">
        <div className="grid grid-cols-5 gap-6">
          <div className="h-[400px] w-full col-span-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={150}
                  paddingAngle={2}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="stroke-background stroke-2"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[400px] w-full col-span-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timeSeriesData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs text-muted-foreground"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  label={{
                    value: 'Date',
                    angle: 0,
                    position: 'bottom',
                    className: "text-xs text-muted-foreground"
                  }}
                />
                <YAxis
                  className="text-xs text-muted-foreground"
                  domain={[-10, 10]}
                  tickFormatter={(value) => `${value.toFixed(1)}`}
                  label={{
                    value: 'Mood Intensity',
                    angle: -90,
                    position: 'insideLeft',
                    className: "text-xs text-muted-foreground"
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dayData = payload[0].payload

                      return (
                        <Card className="border-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              {label} ({dayData.totalEntries} entries)
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-xs text-muted-foreground">
                              Average Mood: {dayData.avgDayScore.toFixed(1)}
                            </div>
                            <div className="space-y-1">
                              {Object.entries(moodCategories).map(([category, info]) => {
                                const score = dayData[`${category}Score`]
                                const count = dayData[`${category}Count`]
                                if (count === 0) return null

                                return (
                                  <div
                                    key={category}
                                    className="flex items-center justify-between gap-2 text-xs"
                                  >
                                    <div className="flex items-center gap-1">
                                      <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: info.color }}
                                      />
                                      <span className="capitalize">{category}</span>
                                    </div>
                                    <span className="text-muted-foreground">
                                      {score.toFixed(1)} ({count} entries)
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    }
                    return null
                  }}
                />
                {Object.entries(moodCategories).map(([category, info]) => (
                  <Area
                    key={category}
                    type="monotone"
                    dataKey={`${category}Score`}
                    stroke={info.color}
                    fill={info.color}
                    fillOpacity={0.3}
                    strokeWidth={2}
                    dot={{
                      r: 3,
                      fill: info.color,
                      strokeWidth: 0
                    }}
                    activeDot={{
                      r: 5,
                      strokeWidth: 0
                    }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodPieChart
