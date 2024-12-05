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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useMemo, useEffect, useCallback } from 'react'
import { startOfToday, subDays, subMonths, startOfDay, startOfWeek, startOfMonth } from 'date-fns'

interface AnalysisData {
  updatedAt: string
  sentimentScore: number
  mood: string
  color: string
}

interface ChartProps {
  data: AnalysisData[]
  avg: number
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    payload: {
      updatedAt: string
      mood: string
      color: string
    }
  }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const analysis = payload[0].payload
    return (
      <Card className="border-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: analysis.color }}
          />
          <CardTitle className="text-sm font-medium">
            {analysis.mood.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          {new Date(label).toLocaleString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </CardContent>
      </Card>
    )
  }
  return null
}

const HistoryChart = ({ data, avg }: ChartProps) => {
  const [timeFilter, setTimeFilter] = useState('all')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const handleDotClick = useCallback((data: AnalysisData) => {
    if (['week', 'month'].includes(timeFilter)) {
      setSelectedDay(startOfDay(new Date(data.updatedAt)).toISOString())
    }
  }, [timeFilter])

  const getXAxisTickFormatter = (value) => {
    if (selectedDay || timeFilter === 'today') {
      return new Date(value).toLocaleTimeString('en-us', {
        hour: 'numeric',
        minute: 'numeric',
      })
    }
    if (timeFilter === 'week') {
      return new Date(value).toLocaleDateString('en-us', {
        weekday: 'short',
      })
    }
    if (timeFilter === 'month') {
      return new Date(value).toLocaleDateString('en-us', {
        day: 'numeric'
      })
    }
    return new Date(value).toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredData = useMemo(() => {
    if (selectedDay) {
      return data.filter(entry =>
        startOfDay(new Date(entry.updatedAt)).toISOString() === selectedDay
      )
    }

    if (timeFilter === 'all') return data

    let date = new Date()
    switch (timeFilter) {
      case 'today':
        date = startOfToday()
        break
      case 'week':
        date = startOfWeek(new Date(), { weekStartsOn: 1 })
        break
      case 'month':
        date = startOfMonth(new Date())
        break
      default:
        return data
    }

    if (timeFilter === 'week') {
      const past7Days = Array.from({ length: 7 }, (_, i) => {
        const day = subDays(new Date(), i)
        return startOfDay(day).toISOString()
      }).reverse()

      const daysWithData = past7Days.filter(day => {
        const entriesForDay = data.filter(entry =>
          startOfDay(new Date(entry.updatedAt)).toISOString() === day
        )
        return entriesForDay.length > 0
      })

      return daysWithData.map(day => {
        const entriesForDay = data.filter(entry =>
          startOfDay(new Date(entry.updatedAt)).toISOString() === day
        )

        const avgScore = entriesForDay.reduce((sum, entry) =>
          sum + entry.sentimentScore, 0) / entriesForDay.length

        return {
          updatedAt: day,
          sentimentScore: avgScore,
          mood: `Average of ${entriesForDay.length} entries`,
          color: entriesForDay[0].color
        }
      })
    }

    if (timeFilter === 'month') {
      const today = new Date()
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      const daysInMonth = lastDayOfMonth.getDate()

      const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
        const day = new Date(today.getFullYear(), today.getMonth(), i + 1)
        return startOfDay(day).toISOString()
      })

      const daysWithData = monthDays.filter(day => {
        const entriesForDay = data.filter(entry =>
          startOfDay(new Date(entry.updatedAt)).toISOString() === day
        )
        return entriesForDay.length > 0
      })

      return daysWithData.map(day => {
        const entriesForDay = data.filter(entry =>
          startOfDay(new Date(entry.updatedAt)).toISOString() === day
        )

        const avgScore = entriesForDay.reduce((sum, entry) =>
          sum + entry.sentimentScore, 0) / entriesForDay.length

        return {
          updatedAt: day,
          sentimentScore: avgScore,
          mood: `Average of ${entriesForDay.length} entries`,
          color: entriesForDay[0].color
        }
      })
    }

    return data.filter(entry => new Date(entry.updatedAt) >= startOfDay(date))
  }, [data, timeFilter, selectedDay])

  const filteredAvg = useMemo(() => {
    const sum = filteredData.reduce((acc, curr) => acc + curr.sentimentScore, 0)
    return filteredData.length ? sum / filteredData.length : 0
  }, [filteredData])

  // Reset selectedDay when changing timeFilter
  useEffect(() => {
    setSelectedDay(null)
  }, [timeFilter])

  return (
    <div className="col-span-4">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-lg font-semibold tracking-tight">
          Sentiment Analysis
        </h2>
        <div className="flex flex-col items-center gap-2 min-h-[52px]">
          {selectedDay && (
            <>
              <h1 className="text-sm font-medium">
                {new Date(selectedDay).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).replace(/\//g, '-')}
              </h1>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Back to {timeFilter} view
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant={filteredAvg > 0 ? 'default' : 'destructive'}
            className="text-xs"
          >
            Average: {filteredAvg.toFixed(1)}/10
          </Badge>
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
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="updatedAt"
              tickFormatter={getXAxisTickFormatter}
              className="text-sm text-muted-foreground"
              dy={15}
              interval={timeFilter === 'today' ? 2 : 'preserveStartEnd'}
            />
            <YAxis
              domain={[-10, 10]}
              tickFormatter={(value) => `${value}`}
              className="text-sm text-muted-foreground"
              dx={-15}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'hsl(var(--muted))' }}
            />
            <Line
              type="monotone"
              dataKey="sentimentScore"
              strokeWidth={2}
              dot={(props) => {
                if (!props.payload) return null
                const isNoEntry = props.payload.mood === 'No entries'
                return (
                  <circle
                    key={props.cx}
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill="hsl(var(--primary))"
                    strokeWidth={1}
                    className={`${isNoEntry ? 'opacity-50' : ''} cursor-pointer`}
                    onClick={() => handleDotClick(props.payload)}
                  />
                )
              }}
              activeDot={{
                r: 6,
                className: 'fill-primary',
                onClick: (props) => handleDotClick(props.payload)
              }}
              className="stroke-primary fill-primary/20"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default HistoryChart
