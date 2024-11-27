import { analyze } from "@/util/ai"
import { getUserByClerkID } from "@/util/auth"
import { prisma } from "@/util/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export const POST = async () => {
    const user = await getUserByClerkID()
    const entry = await prisma.journalEntry.create({
        data: {
           userId: user.id,
           content: "Write about your day"
        }
    })

    const analysis = await analyze(entry.content)
    await prisma.analysis.create({
        data: {
            userId: user.id,
            entryId: entry.id,
            ...analysis
        }
    })

    revalidatePath('/journal')

    return NextResponse.json({ data: entry })
}