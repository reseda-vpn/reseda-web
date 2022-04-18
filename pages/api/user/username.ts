import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// GET /api/usage
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { userId, username } = await JSON.parse(req.body);
    
    const result = await prisma.user.update({
        data: {
            name: username as string
        },
        where: {
            id: userId as string
        }
    });

    res.json(result)
}