import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// POST /api/user
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userId = req.query.id.toString();

    console.log(String(userId));

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

        console.log(result);

        // const updatedData = JSON.stringify(result, (_key, value) => {
        //     typeof value === 'bigint' ? value = value.toString() : value
        // })
        
        res.json(result);
    }else {
        res.json({});
    }
}