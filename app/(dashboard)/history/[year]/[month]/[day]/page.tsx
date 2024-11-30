import { getUserByClerkID } from '@/util/auth'
import { prisma } from '@/util/db'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import EntryCard from '@/components/EntryCard'
import { format } from 'date-fns'

interface PageProps {
    params: {
        year: string
        month: string
        day: string
    }
}

const getDayEntries = async (year: string, month: string, day: string) => {
    const user = await getUserByClerkID()

    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(startDate)
    endDate.setHours(23, 59, 59, 999)

    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user.id,
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        },
        include: {
            analysis: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return entries
}

const DailyEntriesPage = async ({ params }: PageProps) => {
    const entries = await getDayEntries(params.year, params.month, params.day)
    const date = new Date(
        parseInt(params.year),
        parseInt(params.month) - 1,
        parseInt(params.day)
    )
    const formattedDate = format(date, 'EEEE, MMMM d, yyyy')

    return (
        <Card className="p-6 bg-card/80 backdrop-blur-xl border-none shadow-sm h-[calc(100vh-108px)]">
            <div className="h-full overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-lg font-semibold tracking-tight">
                        Entries for {formattedDate}
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entries.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground">
                            No entries found for this day
                        </div>
                    ) : (
                        entries.map((entry) => (
                            <div key={entry.id} className="relative">
                                <Link href={`/journal/${entry.id}`}>
                                    <EntryCard entry={entry} />
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Card>
    )
}

export default DailyEntriesPage 