import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// POST /api/user
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userId = req.query.id.toString();

    console.log(Number(userId));

    if(Number(userId)) {
        const result = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });

        const updatedData = JSON.stringify(result, (_key, value) => {
            typeof value === 'bigint' ? value = value.toString() : value
        })
    
        console.log(result);
    
        res.json(result);
    }else {
        res.json({});
    }
}