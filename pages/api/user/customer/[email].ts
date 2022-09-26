import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'
import Stripe from 'stripe';

// GET /api/usage
// Required fields in body: name, email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.query as { email: string };

    const stripe = new Stripe('sk_test_51KHl5DFIoTGPd6E4mnIhFWzGz1jMles82MHAZVUUrhY08sA9uJvsqhvtrJKam6ZiOA8HVg6VxdCvkkEe7XBbkrfQ00P1AKNTAk', {
        apiVersion: '2022-08-01'
    });

    if(!email || typeof email == "undefined") {
        res.status(404)
        return;
    }

    const result = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            "accounts": true
        }
    });

    const billing_information = await stripe.customers.retrieve(result.accounts[0].billing_id);
    
    res.json({
        ...billing_information
    });
}