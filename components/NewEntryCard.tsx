'use client'

import { Card, CardContent } from '@/components/ui/card'
import { createNewEntry } from '@/util/api'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { toast } from "sonner"

const NewEntryCard = () => {
  const router = useRouter()

  const handleOnClick = async () => {
    const data = await createNewEntry()
    router.push(`/journal/${data.id}`)
    toast("New entry created!", {
      description: "Your journal entry has been created successfully.",
      duration: 3000,
    })
  }

  return (
    <Card 
      className="group h-[200px] relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border border-dashed border-primary/20 bg-card/80 backdrop-blur-sm"
      onClick={handleOnClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      
      <CardContent className="h-full flex flex-col items-center justify-center relative">
        <PlusCircle className="h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
        <p className="text-lg font-medium text-primary mt-4">
          New Entry
        </p>
      </CardContent>
    </Card>
  )
}

export default NewEntryCard
