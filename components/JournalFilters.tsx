'use client'

import { Button } from "@/components/ui/button"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation'
import { PenLine, Plus } from 'lucide-react'
import { createNewEntry } from '@/util/api'
import { toast } from "sonner"

interface JournalFiltersProps {
    filter: string
    sort: string
}

const JournalFilters = ({ filter, sort }: JournalFiltersProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleNewEntry = async () => {
        const data = await createNewEntry()
        router.push(`/journal/${data.id}`)
        toast("New entry created!", {
            description: "Your journal entry has been created successfully.",
            duration: 3000,
        })
    }

    const setFilter = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === 'all') {
            params.delete('filter')
        } else {
            params.set('filter', value)
        }
        router.push(`/journal?${params.toString()}`)
    }

    const setSort = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === 'latest') {
            params.delete('sort')
        } else {
            params.set('sort', value)
        }
        router.push(`/journal?${params.toString()}`)
    }

    return (
        <div className="flex items-center justify-between gap-4 mb-5">
            <Button
                onClick={handleNewEntry}
                variant="outline"
                className="relative group border border-primary hover:border-primary bg-background/50 hover:bg-background/80 backdrop-blur-sm shadow-none"
            >
                <div className="absolute inset-0 transition-all duration-300 group-hover:bg-primary/5 rounded-md" />
                <Plus className="w-4 h-4 mr-1 transition-all duration-300 group-hover:rotate-90 text-primary group-hover:text-primary" />
                <span className="text-primary group-hover:text-primary transition-colors duration-300">New Entry</span>
            </Button>

            <div className="flex items-center gap-4">
                <ToggleGroup
                    type="single"
                    value={filter}
                    onValueChange={(value) => {
                        if (value) setFilter(value)
                    }}
                    className="font-sm"
                >
                    <ToggleGroupItem value="all" aria-label="All entries" className="font-sm">
                        All
                    </ToggleGroupItem>
                    <ToggleGroupItem value="today" aria-label="Today's entries" className="font-sm">
                        Today
                    </ToggleGroupItem>
                    <ToggleGroupItem value="week" aria-label="Past week entries" className="font-sm">
                        Past Week
                    </ToggleGroupItem>
                    <ToggleGroupItem value="month" aria-label="Past month entries" className="font-sm">
                        Past Month
                    </ToggleGroupItem>
                </ToggleGroup>

                <Select
                    value={sort}
                    onValueChange={setSort}
                >
                    <SelectTrigger className="w-[130px] focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default JournalFilters