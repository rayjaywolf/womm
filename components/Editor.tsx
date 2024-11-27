'use client'

import { updateEntry } from '@/util/api'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { CalendarDays, Save } from 'lucide-react'

const getLuminance = (color: string) => {
  // Remove any leading #
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance
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
    { name: 'Subject', value: subject.charAt(0).toUpperCase() + subject.slice(1), icon: '📝' },
    { name: 'Summary', value: summary.charAt(0).toUpperCase() + summary.slice(1), icon: '📋' },
    { name: 'Mood', value: mood.toUpperCase(), icon: '😊' },
    { name: 'Sentiment', value: `${sentimentScore}/10`, icon: '📊' },
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
    <div className="h-full p-5 bg-card/40">
      <div className="max-w-[1500px] h-full mx-auto space-y-6">
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-100px)]">
          <Card className="col-span-2 h-full">
            <CardHeader className="p-6 border-b">
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
            <CardContent className="p-6">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-[calc(100%-24px)] p-0 text-lg bg-background resize-none focus:outline-none"
                placeholder="Write your thoughts here..."
              />
            </CardContent>
          </Card>

          <Card className="h-full rounded-t-xl">
            <CardHeader
              className="p-6 border-b rounded-t-xl"
              style={{ 
                backgroundColor: color,
                color: getLuminance(color) > 0.5 ? 'black' : 'white'
              }}
            >
              <CardTitle>Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-[60px]" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-6">
                  {analysisData.map((item) => (
                    <li
                      key={item.name}
                      className="flex flex-col space-y-2 pb-5 border-b last:pb-0 last:border-0"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-medium text-muted-foreground">
                          {item.name}
                        </span>
                      </div>
                      <span
                        className={cn(
                          'text-sm pl-7',
                          item.name === 'Sentiment' &&
                            Number(item.value.split('/')[0]) > 5
                            ? 'text-green-500 font-medium'
                            : item.name === 'Sentiment'
                              ? 'text-red-500 font-medium'
                              : '',
                        )}
                      >
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Editor
