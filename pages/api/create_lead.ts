// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Lancero from "@lancero/node";
import { NextApiRequest, NextApiResponse } from "next";

const lancero = new Lancero(process.env.LANCERO_API);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    lancero.leads.create({
        email: req.body
    }).then(e => {
        if(e.success) {
            res .status(200)
                .json({ name: 'John Doe' })
        }else {
            res .status(400)
                .json({ error: e.data })
        }
    });
}
  