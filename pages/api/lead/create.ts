import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// POST /api/user
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const result = await prisma.lead.create({
    data: {
      ...req.body,
    },
  })
  res.json(result)
}