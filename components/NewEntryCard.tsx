'use client'

import { Card, CardContent } from '@/components/ui/card'
import { createNewEntry } from '@/util/api'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'

const NewEntryCard = () => {
  const router = useRouter()

  const handleOnClick = async () => {
    const data = await createNewEntry()
    router.push(`/journal/${data.id}`)
  }

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer group h-[200px] border border-dashed relative overflow-hidden"
      onClick={handleOnClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 group-hover:animate-gradient-xy" />
      <CardContent className="h-full flex flex-col items-center justify-center relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-lg opacity-10" />
          <PlusCircle className="h-12 w-12 mb-4 relative z-10 text-primary" />
        </div>
        <p className="text-lg font-medium text-primary mt-4">
          New Entry
        </p>
      </CardContent>
    </Card>
  )
}

export default NewEntryCard
