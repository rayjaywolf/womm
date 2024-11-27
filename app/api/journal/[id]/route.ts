import { getUserByClerkID } from "@/util/auth"
import { prisma } from "@/util/db"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, {params}) => {
    const {content} = await request.json()
    const user = await getUserByClerkID()
    const updateEntry = await prisma.journalEntry.update({
        where: {
            userId_id: {
                userId: user.id,
                id: params.id
            }
        },
        data: {
            content
        }
    })

    return NextResponse.json({ data: updateEntry })
}