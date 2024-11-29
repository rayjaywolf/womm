import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const colorMapping = {
  '#D3D3D3': '#404040',
  '#ADD8E6': '#00008B',
  '#98FB98': '#006400',
  '#A3D9FF': '#00008B',
  '#FFB6C1': '#8B0000',
  '#90EE90': '#006400',
  '#C0C0C0': '#404040',
  '#A9A9A9': '#404040',
  '#FFFF00': '#8B8B00',
  '#FFC0CB': '#8B0000',
  '#FFE4E1': '#8B0000',
  '#F0FFF0': '#006400',
  '#FFD602': '#8B8B00',
}

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
  const darkVariant = colorMapping[moodColor]
  const needsDarkVariant = colorMapping.hasOwnProperty(moodColor)

  return (
    <Card className="group h-[200px] relative overflow-hidden transition-all duration-300 shadow-none hover: bg-card/80 backdrop-blur-sm">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at top right, ${moodColor}10, transparent)`,
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: moodColor }}
            />
            <span className="font-medium text-sm">{date}</span>
          </div>
          <span className="text-xs text-muted-foreground/60 pl-4">{time}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative">
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-full transition-all duration-500"
            style={{ backgroundColor: `${moodColor}30` }}
          />
          <p className="text-xs text-muted-foreground/80 line-clamp-3 pl-4">
            {summary}
          </p>
        </div>
      </CardContent>

      <CardFooter className="absolute bottom-0 left-0 w-full pb-4 px-6">
        <Badge
          variant="secondary"
          style={{
            backgroundColor: `${moodColor}20`,
            color: needsDarkVariant ? darkVariant : moodColor,
            borderColor: needsDarkVariant
              ? `${darkVariant}50`
              : `${moodColor}50`,
          }}
          className={cn(
            'font-medium transition-all duration-300',
            needsDarkVariant ? `${darkVariant}50` : `${moodColor}50`,
          )}
        >
          {mood}
        </Badge>
      </CardFooter>

      <div
        className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{
          background: `linear-gradient(to right, transparent, ${moodColor}40, transparent)`,
        }}
      />
    </Card>
  )
}

export default EntryCard
