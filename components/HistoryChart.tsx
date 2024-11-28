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

const CustomTooltip = ({
  payload,
  label,
  active,
}: {
  payload: any
  label: any
  active: any
}) => {
  const dateLabel = new Date(label).toLocaleString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })

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
          {dateLabel}
        </CardContent>
      </Card>
    )
  }

  return null
}

const HistoryChart = ({ data, avg }) => {
  return (
    <div className="col-span-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold tracking-tight">
          Sentiment Analysis
        </h2>
        <Badge
          variant={avg > 0 ? 'default' : 'destructive'}
          className="text-xs"
        >
          Average: {avg.toFixed(1)}/10
        </Badge>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="updatedAt"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-us', {
                month: 'short',
                day: 'numeric'
              })}
              className="text-sm text-muted-foreground"
              dy={15}
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
              activeDot={{
                r: 8,
                className: 'fill-primary',
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
