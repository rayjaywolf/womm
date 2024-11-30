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
    }
}

const getMonthEntries = async (year: string, month: string) => {
    const user = await getUserByClerkID()

    // Start of the month (midnight)
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
    startDate.setHours(0, 0, 0, 0)

    // End of the month (last millisecond)
    const endDate = new Date(parseInt(year), parseInt(month), 0)
    endDate.setHours(23, 59, 59, 999)

    console.log('Date range:', { startDate, endDate }) // For debugging

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

const MonthlyEntriesPage = async ({ params }: PageProps) => {
    const entries = await getMonthEntries(params.year, params.month)
    const monthName = format(new Date(parseInt(params.year), parseInt(params.month) - 1), 'MMMM yyyy')

    return (
        <Card className="p-6 bg-card/80 backdrop-blur-xl border-none shadow-sm h-[calc(100vh-108px)]">
            <div className="h-full overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-lg font-semibold tracking-tight">
                        Entries for {monthName}
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entries.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground">
                            No entries found for this month
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

export default MonthlyEntriesPage