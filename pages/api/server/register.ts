import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

// POST /server/register
// Required fields in body: id, location, country, hostname, flag
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const result = await prisma.server.create({
    data: {
      ...req.body,
    },
  })
  res.json(result)
}