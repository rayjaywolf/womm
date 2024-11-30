import { analyze } from "@/util/ai"
import { getUserByClerkID } from "@/util/auth"
import { prisma } from "@/util/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
    const { id } = await request.json()
    const user = await getUserByClerkID()
    const entry = await prisma.journalEntry.create({
        data: {
            id,
            userId: user.id,
            content: ""
        }
    })

    const defaultAnalysis = {
        mood: "no mood",
        subject: "no subject",
        summary: "no summary",
        negative: false,
        color: "#A9A9A9",
        sentimentScore: 0
    }

    await prisma.analysis.create({
        data: {
            userId: user.id,
            entryId: entry.id,
            ...defaultAnalysis
        }
    })

    revalidatePath('/journal')

    return NextResponse.json({ data: entry })
}