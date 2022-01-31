import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// POST /api/user
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userId = req.query.id.toString();

    if(String(userId)) {
        const result = await prisma.user.findUnique({
            where: {
                email: String(userId)
            },
            select: {
                'accounts': true,
                'email': true,
                'name': true
            }
        });

        res.json(result);
    }else {
        res.json({});
    }
}