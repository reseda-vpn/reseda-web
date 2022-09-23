import { useEffect, useState } from 'react';
import { Gradient } from '@components/gradient'
import { useRouter } from 'next/router';
import { Activity, ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, Check, CreditCard, Delete, Download, Edit, Eye, Info, Lock, LogOut, Settings, Trash, User as UserIcon, X } from 'react-feather';

import { useSession, getSession, signIn, signOut, getCsrfToken } from "next-auth/react"
import { Account, Usage, User } from '@prisma/client';
import Button from '@components/un-ui/button';
import useMediaQuery from '@components/media_query';
import prisma from "@root/lib/prisma"
import { HiLockClosed } from "react-icons/hi"
import BillingInput from '@components/billing_input';
import { loadStripe } from '@stripe/stripe-js';
import {
    CardElement,
    Elements,
    useStripe,
    useElements,
  } from '@stripe/react-stripe-js';
import CheckoutForm from '@components/checkout_form';

const stripePromise = loadStripe('pk_test_51KHl5DFIoTGPd6E4i9ViGbb5yHANKUPdzKKxAMhzUGuAFpVFpdyvcdhBSJw2zeN0D4hjUvAO1yPpKUUttHOTtgbv00cG1fr4Y5');

export const getServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });
    const csrfToken = await getCsrfToken({ req: req });

    if (!session) return { props: {}, redirect: { destination: '/login?goto=\"billing\/plan\"', permanent: false } }

    const exists = prisma.lead.findUnique({
		where: { email: session.user.email }
	}).then(e => {
        return {
            ...e, 
            signupAt: e.signupAt.toJSON() as unknown as Date
        }
    })

    const user = prisma.user.findUnique({
            where: {
                email: String(session.user.email)
            },
            select: {
                'accounts': true,
                'email': true,
                'name': true
            }
    }).then(e => {
        return {
            ...e, 
            accounts: e.accounts.map(ek => { 
                        ek.createdAt = ek.createdAt.toJSON() as unknown as Date;
                        ek.updatedAt = ek.updatedAt.toJSON() as unknown as Date;
    
                        return ek;
                    }) 
        }
    })

    return {
        props: {
            ss_session: session,
            user: await user,
            eligible: await exists,
            csrfToken
        },
    }
}

export default function Home({ ss_session, token, user, eligible }) {
    const session = useSession(ss_session);
	const small = useMediaQuery(640);

    const [ userInformation, setUserInformation ] = useState<Account>(null);
    const [ usageInformation, setUsageInformation ] = useState<Usage[]>(null);

    const [ location, setLocation ] = useState<{
        page: 0 | 1 | 2 | 3,
        plan: "FREE" | "PRO" | "BASIC",
        billing: {
            card_number: string,
            card_date: string,
            cvv: string,

            billing_address: string,
            zip_code: string
        }
    }>({
        page: 0,
        plan: null,
        billing: {
            card_number: null,
            card_date: null,
            cvv: null,

            billing_address: null,
            zip_code: null
        }
    });

	useEffect(() => {
        localStorage.setItem("reseda.jwt", JSON.stringify(ss_session?.jwt));

        setUserInformation(user.accounts[0]);
        // setUsageInformation(usage);

        if(!small) {
            // Create your instance
            const gradient = new Gradient()

            try {
                // //@ts-expect-error
                gradient.el = document.querySelector('#gradient-canvas');
                gradient.connect();
            }
            catch {
                console.log("Unable to initialize gradient, possibly mobile.")
            }
        }

        // if(session.status !== "authenticated") router.push('/login?goto=\"billing\/plan\"');

        const as = async () => {
            if(!usageInformation || usageInformation.length !== 0) {
                fetch(`/api/user/usage/${user.accounts[0].userId}`).then(async e => {
                    const data = await e.json();
                    setUsageInformation(data);
                });
        
                fetch(`/api/user/customer/${user.email}`).then(async e => {
                    console.log(e);
                });
            }
        }

        if(session.status == "authenticated") as();    
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	return (
		<Elements stripe={stripePromise}>
            <CheckoutForm ss_session={ss_session} user={user} />
        </Elements>
	)
}