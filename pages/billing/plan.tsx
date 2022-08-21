import { useEffect, useMemo, useRef, useState } from 'react';
import { Gradient } from '@components/gradient'
import { useRouter } from 'next/router';
import styles from '@styles/Home.module.css'
import Header from '@components/header';
import { Activity, ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, Check, CreditCard, Delete, Download, Edit, Eye, LogOut, Settings, Trash, User as UserIcon, X } from 'react-feather';

import {loadStripe} from '@stripe/stripe-js';
import { useSession, getSession, signIn, signOut, getCsrfToken } from "next-auth/react"
import { Account, Usage, User } from '@prisma/client';
import Button from '@components/un-ui/button';
import useMediaQuery from '@components/media_query';
import Loader from '@components/un-ui/loader';
import Chart from '@components/chart';
import prisma from "@root/lib/prisma"
import LinearChart from '@components/linear_chart';
import Input from '@components/un-ui/input';
import InputField from '@components/un-ui/input_field';
import { FaExclamationTriangle } from 'react-icons/fa';
import Billing, { getSize } from '@components/billing';
import { isBuffer } from 'util';
import CurrentPlan from '@components/current_plan';

export const getServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });
    const csrfToken = await getCsrfToken({ req: req });

    if (!session) return { props: {}, redirect: { destination: '/login', permanent: false } }

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
    const router = useRouter();

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

        if(session.status !== "authenticated") router.push('/login');

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
		<div className="flex-col flex font-sans min-h-screen bg-white" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
            <div 
                className="absolute left-0 top-0 p-4 flex flex-row items-center gap-2 cursor-pointer"
                onClick={() => {
                    router.push("/profile")
                }}
            >
                <ArrowLeft strokeWidth={1}></ArrowLeft>
                <p>Go Back</p>
            </div>
            <div className="flex flex-col items-center py-56 gap-12 mx-[500px]">
                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-2xl">Change Plan</h1>

                    <div className="flex flex-row items-center gap-1">
                        <p className="text-gray-500">Currently</p>

                        {
                            (() => {
                                switch(userInformation?.tier) {
                                    case "FREE":
                                        return (
                                            <>
                                                <h2 className="text-lg font-semibold text-orange-300 cursor-pointer">FREE</h2>
                                            </>
                                        )
                                    case "BASIC":
                                        return (
                                            <>
                                                <h2 className="text-lg font-semibold text-orange-400 cursor-pointer">BASIC</h2>
                                            </>
                                        )
                                    case "PRO":
                                        return (
                                            <>
                                                <h2 className="text-lg font-semibold text-orange-500 cursor-pointer">PRO</h2>
                                            </>
                                        )
                                    case "SUPPORTER":
                                        return (
                                            <>
                                                <h2 className="text-lg font-semibold text-orange-300 cursor-pointer bg-gradient-to-tr text-transparent bg-clip-text">SUPPORTER</h2>
                                            </>
                                        )
                                    default:
                                        return (
                                            <></>
                                        )
                                }
                            })()
                        }
                    </div>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="w-1/4 !border-0 bg-white p-[24px] align-bottom font-normal"></th>
                            <th className="w-1/4 !rounded-tl border-b-0 border-l p-[24px] align-top text-base text-primary">
                                <h2 className="text-base font-semibold md:text-lg ">Hobby</h2>
                                <div className="mb-2 font-medium">Free</div>
                                <Button icon={<></>} className="bg-gray-200 font-medium text-sm">Go Free</Button>
                            </th>
                            <th className="w-1/4 border-b-0 border-l p-[24px]  align-top text-base text-primary">
                                <h2 className="text-base font-semibold md:text-lg ">Scaler</h2>
                                <div className="mb-2 font-medium">
                                    $29 
                                    <span className="text-secondary">/ month</span>
                                </div>
                                <Button icon={<></>} className="bg-black text-white font-medium text-sm">Upgrade</Button>
                            </th>
                            <th className="w-1/4 !rounded-br-none border-b-0 border-l border-r p-[24px]  align-top text-base text-primary">
                                <h2 className="text-base font-semibold md:text-lg ">Team</h2>
                                <div className="mb-2 font-medium">
                                    $599 
                                    <span className="text-secondary">/ month</span>
                                </div>
                                <Button icon={<></>} className="bg-black text-white font-medium text-sm">Upgrade</Button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm md:text-base">
                        <tr>
                            <td className="rounded-tl border-t border-l font-medium">Storage</td>
                            <td className="border-t border-l">5 GB</td>
                            <td className="border-t border-l">10 GB</td>
                            <td className="border-t border-l border-r">100 GB</td>
                        </tr>
                        <tr>
                            <td className="rounded-tl border-t border-l font-medium">Storage</td>
                            <td className="border-t border-l">5 GB</td>
                            <td className="border-t border-l">10 GB</td>
                            <td className="border-t border-l border-r">100 GB</td>
                        </tr>
                        <tr>
                            <td className="rounded-tl border-t border-l font-medium">Storage</td>
                            <td className="border-t border-l">5 GB</td>
                            <td className="border-t border-l">10 GB</td>
                            <td className="border-t border-l border-r">100 GB</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
	)
}