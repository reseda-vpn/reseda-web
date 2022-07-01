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
    console.log(req.body);
    const { override, ...json }: Server = await JSON.parse(req.body);
    const server_exists = await prisma.server.findFirst({
        where: {
            OR: [
                {
                    id: json.id
                },
                {
                    hostname: json.hostname
                }
            ]
        }
    });
    
    if(!server_exists) {
        console.log("Creating New Server");

        console.log({
            ...json,
            virtual: json.virtual == 'true' ? true : false,
        });

        const result = await prisma.server.create({
            data: {
                ...json,
                virtual: json.virtual == 'true' ? true : false,
            },
        }).catch(e => {
            console.log(e);
            res.json({
                error: e,
                reason: "See Error Object",
                data: result
            })
        })
    
        console.log(result);

        res.json({
            error: "",
            reason: "Success - Updated",
            data: result
        });
    }else if(override == 'true') {
        const result = await prisma.server.update({
            where: {
                id: json.id
            },
            data: {
                ...json,
                virtual: json.virtual == 'true' ? true : false,
            },
        });
    
        console.log(result);

        res.json({
            error: "",
            reason: "Success - Overridden",
            data: result
        });
    }else {
        res.json({
            error: "failure",
            reason: "Server Exists - Pass Override Flag to override existing server.",
            data: {}
        })
    }
}