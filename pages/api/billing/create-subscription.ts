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
        // Check if they have an existing subscription, if so cancel it.
        const customer: Stripe.Customer = await stripe.customers.retrieve(customerId, {
            expand: ['subscriptions']
        }) as Stripe.Customer;
        
        if(customer.subscriptions.data.length > 0) {
            const existingSubscription = customer.subscriptions.data[0].id;

            const cancelInvoice = await stripe.subscriptions.cancel(existingSubscription, {
                invoice_now: true,
            });
        }

        // If subscribing to FREE, we do not need to charge or create a new subscription.
        if(tier == "FREE") {
            res.status(200).send({
                message: "Canceled subscription, subscribed to free"
            });

            return;
        }

        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
                price: priceId,
            }],
            payment_behavior: 'allow_incomplete',
            expand: ['latest_invoice.payment_intent'],
            metadata: {
                tier: tier
            },
            payment_settings: {
                save_default_payment_method: 'on_subscription'
            }
        });

        const invoice: Stripe.Invoice = subscription.latest_invoice as Stripe.Invoice;
        
        const setupIntent = await stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ['card']
        });

        res.status(200).send({
            subscriptionId: subscription.id,
            invoiceId: typeof subscription.latest_invoice !== "string" ?  subscription.latest_invoice?.id : "NULL",
            clientSecret: setupIntent.client_secret,
            invoiceURL: invoice.hosted_invoice_url
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: { message: error.message } });
    }
}