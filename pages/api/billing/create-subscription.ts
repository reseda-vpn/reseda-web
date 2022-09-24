import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SEC, {
    apiVersion: '2022-08-01'
});

// POST /api/user
// Required fields in body: customerId, priceId
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { customerId, priceId, tier, customerEmail } = typeof req.body == "string" ? JSON.parse(req.body) : req.body;

    try {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
                price: priceId,
            }],
            payment_behavior: 'allow_incomplete',
            // payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            metadata: {
                tier: tier
            },
            payment_settings: {
                save_default_payment_method: 'on_subscription'
            }
        });

        console.log("Latest Invoice from Subscription: ", subscription.latest_invoice);

        const pInt = await stripe.paymentIntents.create({
            amount: 100,
            currency: 'nzd',
            setup_future_usage: 'off_session',
            payment_method_types: ['card'],
            customer: customerId,
            receipt_email: customerEmail,
        });

        res.status(200).send({
            subscriptionId: subscription.id,
            invoiceId: typeof subscription.latest_invoice !== "string" ?  subscription.latest_invoice?.id : "NULL",
            clientSecret: pInt.client_secret,
            invoiceURL: null
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: { message: error.message } });
    }
}