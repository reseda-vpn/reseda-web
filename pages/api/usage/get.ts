import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

type Usage = {
    id: string,
    userId: string,
    up: string,
    down: string,
    serverId: string,
    connStart: string
}

// GET /usage/log
// Required fields in body: id, userId, connEnd, up, down, serverId, server, connStart
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    // Obtain all data for the user provided
    const request: { id: string } = await JSON.parse(req.body);

    const result = await prisma.usage.findMany({
        where: {
            userId: request.id
        }
    }).catch(e => {
        console.log(e);
        res.json({
            error: e,
            reason: "See Error Object",
            data: result
        })
    })
    
    res.json({
        error: "",
        reason: "Returned.",
        data: result
    })   
}