import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// GET /api/usage
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    const result = await prisma.usage.findMany({
        where: {
            userId: userId.toString(),
            connEnd: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
        }
    });

    res.json(result)
}