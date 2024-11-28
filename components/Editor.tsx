'use client'

import { updateEntry } from '@/util/api'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { CalendarDays, Save } from 'lucide-react'
import { Textarea } from './ui/textarea'

const getLuminance = (color: string) => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance
}

const getMoodEmoji = (score: number) => {
  if (score >= 8) return '😄'
  if (score >= 6) return '🙂'
  if (score >= 4) return '😐'
  if (score >= 2) return '🙁'
  return '😢'
}

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState(entry.analysis)
  const date = new Date(entry.createdAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const { mood, subject, summary, negative, color, sentimentScore } = analysis
  const analysisData = [
    {
      name: 'Subject',
      value: subject.charAt(0).toUpperCase() + subject.slice(1),
      icon: '📝',
    },
    {
      name: 'Summary',
      value: summary.charAt(0).toUpperCase() + summary.slice(1),
      icon: '📋',
    },
    {
      name: 'Mood',
      value: mood.toUpperCase(),
      icon: getMoodEmoji(sentimentScore),
    },
    { name: 'Negative', value: negative ? 'Yes' : 'No', icon: '🎯' },
  ]

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true)
      const data = await updateEntry(entry.id, _value)
      setAnalysis(data.data.analysis)
      setIsLoading(false)
    },
  })

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-108px)]">
      <Card className="col-span-2 flex flex-col overflow-hidden shadow-sm border-none">
        <CardHeader className="flex-none border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle>Journal Entry</CardTitle>
            <div className="flex items-center gap-6">
              {isLoading && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Save className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Saving...</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm">{date}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-full rounded-none border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 px-5"
            placeholder="Write your thoughts here..."
            ref={(textarea) => {
              if (textarea) {
                textarea.selectionStart = textarea.value.length
                textarea.selectionEnd = textarea.value.length
                textarea.focus()
              }
            }}
          />
        </CardContent>
      </Card>

      <Card className="flex flex-col overflow-hidden shadow-sm border-none bg-card/80 backdrop-blur-xl">
        <CardHeader
          className="flex-none px-6 py-4"
          style={{
            background: `linear-gradient(to right, ${color}10, ${color}30)`,
            borderBottom: `1px solid ${color}20`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="h-10 w-10 rounded-xl relative"
                style={{
                  background: `linear-gradient(135deg, ${color}20, ${color})`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-xl opacity-50 blur-sm"
                  style={{
                    background: color,
                  }}
                />
              </div>
              <div>
                <CardTitle className="text-lg font-medium tracking-tight mb-1">
                  Analysis
                </CardTitle>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5 text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-light tracking-tight">
                  {sentimentScore}
                </span>
                <span className="text-sm font-light text-muted-foreground/60">
                  /10
                </span>
              </div>
              <span className="text-xs font-medium text-muted-foreground/60 tracking-wide">
                Sentiment Score
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-full h-[80px]" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {analysisData.map((item) => (
                <div key={item.name} className="relative group">
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${color}10, ${color}30)`,
                      transform: 'translateY(0)',
                    }}
                  />
                  <div
                    className="relative bg-card/50 backdrop-blur-sm rounded-xl p-4 transition-all duration-500 group-hover:translate-y-[-2px] hover:shadow-lg"
                    style={{
                      boxShadow: `0 4px 20px -4px ${color}15`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl transition-transform duration-500 group-hover:scale-105">
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <p
                      className={cn(
                        'text-sm pl-11 text-muted-foreground transition-colors duration-500',
                        item.name === 'Sentiment' &&
                          Number(item.value.split('/')[0]) > 5
                          ? 'text-green-500 font-medium'
                          : item.name === 'Sentiment'
                            ? 'text-red-500 font-medium'
                            : '',
                      )}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Editor
