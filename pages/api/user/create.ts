import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'
import { User } from '@prisma/client'

// POST /api/user
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const result: User = await prisma.user.create({
    data: {
      ...req.body
    },
  })
  res.json(result)
}