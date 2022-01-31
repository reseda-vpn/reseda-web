import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// POST /api/user
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { email } = req.body;
	const exists = await prisma.lead.findUnique({
		where: { email: email }
	});

	if(exists) {
		res.json({
			data: exists,
			type: "pre-existing"
		});
	}else {
		const result = await prisma.lead.create({
			data: {
				email,
			}
		})
	
		res.json({
			data: result,
			type: "new"
		});
	}
}