import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@root/lib/prisma'
import Stripe from 'stripe';
import { env } from 'process';

const stripe = new Stripe(process.env.STRIPE_SEC, {
    apiVersion: '2022-08-01'
});

// POST /api/user
// Required fields in body: customerId, priceId
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { newPlan, userId, subscriptionId } = typeof req.body == "string" ? JSON.parse(req.body) : req.body;

    if(!env.SUPPORTER_TIER && newPlan == "SUPPORTER") {
        res.status(422).send({ message: `The SUPPORTER tier is no longer recognized. Please try using the FREE tier instead.` });
        return;
    }

    if(newPlan == "FREE" || newPlan == "SUPPORTER") {
        // Both of these tiers are freely accessible.
        // Notably, any user can upgrade from FREE to SUPPORTER by knowledge of this API which is understood.
        // This is not restricted as the DEFAULT tier is SUPPORTER currently. 
        // In the future, no upgrades to SUPPORTER will be supported, as set above by the environment variable.

        await prisma.account.update({
            where: {
                id: userId
            },
            data: {
                tier: newPlan
            }
        });

        // Check if update worked, if not, retry.
    }else if(newPlan == "PRO" || newPlan == "BASIC") {
        // Check they are paying for it!
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const user = await prisma.account.findUnique({
            where: {
                id: userId
            }
        });

        if(user.billing_id == subscription.customer) {
            if(subscription.metadata.tier == newPlan) {
                // We know the user we are setting has:
                // 1. A Billing Identifier which matches the customers subscription customer (stripe's subscription matches stored user)
                // 2. A new plan they wish to be set to which the website has requested, which is EQUAL to that which the user is subscribed for (i.e. no over/under charging)

                await prisma.account.update({
                    where: {
                        id: userId
                    },
                    data: {
                        tier: newPlan
                    }
                });
            }else {
                res.status(422).send({ message: `API was sent to update to the ${newPlan} plan, user is signed up for ${subscription.metadata.tier}` });
                return;
            }
        }else {
            res.status(422).send({ message: `User is not the correct user.` });
            return;
        }
    }else {
        res.status(400).send({ message: `Invalid tier. Possible options are FREE, ${env.SUPPORTER_TIER ? "SUPPORTER , " : ""}BASIC and PRO` });
        return;
    }

    res.status(200).send({ message: `Successfully updated plan to ${newPlan}` })
}