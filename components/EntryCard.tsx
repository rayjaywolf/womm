import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const EntryCard = ({ entry }) => {
  const dateObj = new Date(entry.createdAt)
  const date = dateObj
    .toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    .replace(/,/g, '')
  const time = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
  const mood = entry.analysis?.mood.toUpperCase() || 'NO MOOD'
  const summary = entry.analysis?.summary
    ? entry.analysis.summary.charAt(0).toUpperCase() +
      entry.analysis.summary.slice(1)
    : 'No summary yet...'
  const moodColor = entry.analysis?.color || '#94a3b8'

  return (
    <Card className="hover:shadow-sm transition-shadow duration-200 h-[200px] flex flex-col shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
          <span>{date}</span>
          <span className="text-xs opacity-50">{time}</span>
        </div>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: moodColor }}
        />
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">{summary}</p>
      </CardContent>
      <CardFooter>
        <Badge
          variant="secondary"
          style={{
            backgroundColor: `${moodColor}20`,
            color: moodColor,
            borderColor: `${moodColor}50`,
          }}
          className="font-medium"
        >
          {mood}
        </Badge>
      </CardFooter>
    </Card>
  )
}

export default EntryCard
