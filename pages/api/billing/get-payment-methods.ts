import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SEC, {
    apiVersion: '2022-08-01'
});

// POST /api/user
// Required fields in body: customerId, priceId
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { customerId } = typeof req.body == "string" ? JSON.parse(req.body) : req.body;

    try {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card'
        });

        res.send({ data: paymentMethods.data });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: { message: error.message } });
    }
}