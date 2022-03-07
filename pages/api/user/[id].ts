import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// POST /api/user
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userId = req.query.id.toString();
    console.log("Found Request");
    const t = new Date().getTime();

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

        console.log("Finished Request in ", new Date().getTime() - t, "ms ");

        res.json(result);
    }else {
        res.json({});
    }
}