import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'

type Server = {
    id: string,
    location: string,
    country: string,
    virtual: string,
    flag: string,
    hostname: string,
    override?: string // re-instantiate server instead of soft-pickup.
}

// POST /server/register
// Required fields in body: id, location, country, hostname, flag
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET')

    const server_pool = await prisma.server.findMany({
        where: {
            virtual: false
        }
    });

    res.json(server_pool);
}