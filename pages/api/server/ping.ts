import type { NextApiRequest, NextApiResponse } from 'next'

// POST /server/register
// Required fields in body: id, location, country, hostname, flag
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { location } = await JSON.parse(req.body);

    const data = await fetch(`http://${location}:6231`, {
        method: "GET",
        redirect: 'follow'
    })

    res.json(data);
}