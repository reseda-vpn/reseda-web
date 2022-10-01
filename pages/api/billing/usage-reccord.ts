import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SEC, {
    apiVersion: '2022-08-01'
});

// POST /api/user
// Required fields in body: customerId, priceId
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { customerId, usageQuantity } = typeof req.body == "string" ? JSON.parse(req.body) : req.body;

    try {
        // Check if they have an existing subscription, if so cancel it.
        const customer: Stripe.Customer = await stripe.customers.retrieve(customerId, {
            expand: ['subscriptions']
        }) as Stripe.Customer;
        
        if(customer.subscriptions.data.length > 0) {
            const existingSubscription = customer.subscriptions.data[0];

            console.log(existingSubscription.id);

            const usageRecord = await stripe.subscriptionItems.createUsageRecord(
                existingSubscription.id,
                { quantity: usageQuantity, timestamp: new Date().getTime() }
            );

            console.log(usageRecord);
            
            return res.status(200)
        }else {
            throw "Unable to retrieve user's subscription"
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: { message: error.message } });
    }
}