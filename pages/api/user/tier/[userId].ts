import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// GET /api/usage
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    const result = await prisma.account.findMany({
        where: {
            id: userId.toString()
        }
    });

    res.json(result[0].tier)
}