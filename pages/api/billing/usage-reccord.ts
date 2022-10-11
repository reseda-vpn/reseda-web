import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SEC, {
    apiVersion: '2022-08-01'
});

// POST /api/user
// Required fields in body: customerId, priceId
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { sessionId } = typeof req.body == "string" ? JSON.parse(req.body) : req.body;

    try {
        const usageLog = await prisma.usage.findFirst({
            where: {
                id: sessionId
            }
        });

        console.log("Setting for ", sessionId);

        if(!usageLog) {
            return res.status(400).send({ error: { message: "Unable to find usage report." } });
        }

        const account = await prisma.account.findUnique({
            where: {
                id: usageLog.userId
            }
        });

        console.log(account);

        if(account.tier == "BASIC" || account.tier == "SUPPORTER") {
            return res.status(400).send({ error: { message: "Reported logging was for a BASIC or SUPPORTER account, this does not require an API call as it is not connected to a stripe billing account." } })
        }

        // Check if they have an existing subscription, if so cancel it.
        const customer: Stripe.Customer = await stripe.customers.retrieve(account.billing_id, {
            expand: ['subscriptions']
        }) as Stripe.Customer;
        
        if(customer.subscriptions.data.length > 0) {
            const existingSubscription = customer.subscriptions.data[0];
            const priceId = existingSubscription.items.data[0].id;

            if(!priceId) {
                return res.status(400).send({ error: { message: "No price ID, nor price associated with subscription - see support." } });
            }

            console.log(new Date().getTime());

            const usageQuantity = usageLog.up > usageLog.down ? parseInt(usageLog.up) / 1000000000 : parseInt(usageLog.down) / 1000000000  

            const usageRecord = await stripe.subscriptionItems.createUsageRecord(
                priceId,
                { quantity: usageQuantity, timestamp: "now" }
            );

            console.log(usageRecord);
            
            return res.status(200).send({ message: `Success, updated record, added ${usageQuantity} items.` });
        }else {
            throw "Unable to retrieve user's subscription"
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: { message: error.message } });
    }
}