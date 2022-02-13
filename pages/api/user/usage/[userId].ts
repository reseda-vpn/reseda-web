import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// GET /api/usage
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    console.log(userId);

    const result = await prisma.usage.findMany({
        where: {
            userId: userId.toString()
        }
    }).catch(e => {
        console.log(e)
    });

    console.log(result);

    res.json(result)
}