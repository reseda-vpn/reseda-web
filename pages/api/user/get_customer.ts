import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'
import Stripe from 'stripe';

// GET /api/usage
// Required fields in body: email
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.query;

    const stripe = new Stripe('sk_test_51KHl5DFIoTGPd6E4mnIhFWzGz1jMles82MHAZVUUrhY08sA9uJvsqhvtrJKam6ZiOA8HVg6VxdCvkkEe7XBbkrfQ00P1AKNTAk', {
        apiVersion: '2022-08-01'
    });

    // stripe.customers.retrieve()

    // const result = await prisma.usage.findMany({
    //     where: {
    //         userId: userId.toString()
    //     }
    // });

    res.status(404)
}