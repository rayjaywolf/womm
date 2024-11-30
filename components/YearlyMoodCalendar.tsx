'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { getMoodEmoji } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface CalendarProps {
    data: {
        date: Date
        averageSentiment: number
        entriesCount: number
    }[]
}

const getSentimentColorClass = (score: number) => {
    if (score >= 5) return 'bg-green-100/80 hover:bg-green-200/90'
    if (score >= 0) return 'bg-green-50/80 hover:bg-green-100/90'
    if (score >= -5) return 'bg-orange-50/80 hover:bg-orange-100/90'
    return 'bg-red-100/80 hover:bg-red-200/90'
}

const YearlyMoodCalendar = ({ data }: CalendarProps) => {
    const router = useRouter()
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    const years = Array.from(
        new Set(data.map(entry => new Date(entry.date).getFullYear()))
    ).sort((a, b) => b - a)

    const months = [
        'December', 'November', 'October', 'September', 'August', 'July',
        'June', 'May', 'April', 'March', 'February', 'January'
    ]

    const getMonthIndex = (displayIndex: number) => {
        return 11 - displayIndex
    }

    const shouldShowMonth = (monthIndex: number) => {
        const selectedYearNum = parseInt(selectedYear)
        if (selectedYearNum < currentYear) return true
        if (selectedYearNum > currentYear) return false
        return monthIndex <= currentMonth
    }

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay()
    }

    const getDataForDate = (date: Date) => {
        return data.find(d =>
            d.date.getFullYear() === date.getFullYear() &&
            d.date.getMonth() === date.getMonth() &&
            d.date.getDate() === date.getDate()
        )
    }

    const handleMonthClick = (monthIndex: number) => {
        console.log('Month clicked:', monthIndex + 1, 'Year:', selectedYear)
        router.push(`/history/${selectedYear}/${monthIndex + 1}`)
    }

    const handleDayClick = (date: Date, hasEntries: boolean) => {
        if (!hasEntries) return
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        router.push(`/history/${year}/${month}/${day}`)
    }

    const hasEntriesInMonth = (monthIndex: number) => {
        const year = parseInt(selectedYear)
        return data.some(entry => {
            const entryDate = new Date(entry.date)
            return entryDate.getFullYear() === year && entryDate.getMonth() === monthIndex
        })
    }

    return (
        <Card className="flex flex-col h-[calc(100vh-108px)] bg-card/80 backdrop-blur-xl border-none shadow-sm">
            <div className="flex-none py-4 px-6 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold tracking-tight">
                        Mood Calendar
                    </CardTitle>
                    <Select
                        value={selectedYear}
                        onValueChange={setSelectedYear}
                    >
                        <SelectTrigger className="w-[100px] focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(year => (
                                <SelectItem
                                    key={year}
                                    value={year.toString()}
                                    disabled={year > currentYear}
                                >
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-3 gap-3">
                    {months.map((month, displayIndex) => {
                        const monthIndex = getMonthIndex(displayIndex)
                        if (!shouldShowMonth(monthIndex)) return null
                        const hasEntries = hasEntriesInMonth(monthIndex)

                        return (
                            <Card key={month} className={`overflow-hidden ${!hasEntries ? 'opacity-50' : ''}`}>
                                <CardHeader
                                    className={`p-3 bg-primary/5 transition-colors
                                        ${hasEntries ? 'cursor-pointer hover:bg-primary/10' : ''}
                                    `}
                                    onClick={(e) => {
                                        if (!hasEntries) return
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleMonthClick(monthIndex)
                                    }}
                                >
                                    <CardTitle className="text-sm font-medium text-center">
                                        {month}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-2">
                                    <div className="grid grid-cols-7 gap-[2px] text-center mb-1">
                                        {[
                                            { key: 'sun', label: 'S' },
                                            { key: 'mon', label: 'M' },
                                            { key: 'tue', label: 'T' },
                                            { key: 'wed', label: 'W' },
                                            { key: 'thu', label: 'T' },
                                            { key: 'fri', label: 'F' },
                                            { key: 'sat', label: 'S' }
                                        ].map(day => (
                                            <div
                                                key={day.key}
                                                className="text-foreground text-sm font-semibold uppercase tracking-wider"
                                            >
                                                {day.label}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-[2px]">
                                        {Array.from({ length: getFirstDayOfMonth(parseInt(selectedYear), monthIndex) }).map((_, i) => (
                                            <div key={`empty-${i}`} className="aspect-square" />
                                        ))}
                                        {Array.from({ length: getDaysInMonth(parseInt(selectedYear), monthIndex) }).map((_, i) => {
                                            const date = new Date(parseInt(selectedYear), monthIndex, i + 1)
                                            const dayData = getDataForDate(date)

                                            return (
                                                <div
                                                    key={i}
                                                    className="aspect-square relative group"
                                                    onClick={() => handleDayClick(date, !!dayData)}
                                                >
                                                    <div className={`
                                                        w-full h-full rounded-sm flex items-center justify-center
                                                        transition-colors duration-200
                                                        ${dayData
                                                            ? getSentimentColorClass(dayData.averageSentiment) + ' cursor-pointer'
                                                            : 'bg-muted/5 hover:bg-muted/10'
                                                        }
                                                    `}>
                                                        {dayData ? (
                                                            <span className="text-xl sm:text-2xl">
                                                                {getMoodEmoji(dayData.averageSentiment)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">
                                                                {i + 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {dayData && (
                                                        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            <Card className="p-2 whitespace-nowrap">
                                                                <div className="font-medium text-sm">
                                                                    {new Date(date).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </div>
                                                                <div className="text-muted-foreground mt-0.5 text-xs">
                                                                    Sentiment: {dayData.averageSentiment.toFixed(1)}/10
                                                                </div>
                                                                <div className="text-muted-foreground text-xs">
                                                                    Entries: {dayData.entriesCount}
                                                                </div>
                                                            </Card>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </Card>
    )
}

export default YearlyMoodCalendar