import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// GET /api/user
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.query;

    const queryEmail = email.toString();    
	const exists = await prisma.lead.findUnique({
		where: { email: queryEmail }
	});

    if(exists.claimable) {
        res.status(200).json({ 
            data: exists,
            type: "eligible"
        });
    }else {
        res.status(200).json({
            data: exists,
            type: "ineligible"
        });
    }
}