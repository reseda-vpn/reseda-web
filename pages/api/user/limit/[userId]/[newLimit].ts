import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// GET /api/usage
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { userId, newLimit } = req.query;

    const result = await prisma.account.update({
        where: {
            userId: userId.toString()
        },
        data: {
            limit: typeof newLimit == "string" ? newLimit : "-1"
        }
    });

    res.json(result)
}