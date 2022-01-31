import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// GET /api/user
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.query;

    console.log(email);
	const exists = await prisma.lead.findFirst({
		where: { email: email },
        select: {
            email: true,
            signupAt: true,
            claimable: true,
            claimed: true,
        }
	});

    console.log(exists);

    // if(exists?.claimable) {
    //     res.json({ 
    //         data: exists,
    //         type: "eligible"
    //     });
    // }else {
    //     res.status(401).json({
    //         data: exists,
    //         type: "ineligible"
    //     });
    // }

    res.status(200);
}