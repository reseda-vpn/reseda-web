import { useEffect, useMemo, useRef, useState } from 'react';
import { Gradient } from '@components/gradient'
import { useRouter } from 'next/router';
import { Activity, ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, Check, CreditCard, Delete, Download, Edit, Eye, Info, Lock, LogOut, Settings, Trash, User as UserIcon, X } from 'react-feather';

import { useSession, getSession, signIn, signOut, getCsrfToken } from "next-auth/react"
import { Account, Usage, User } from '@prisma/client';
import Button from '@components/un-ui/button';
import useMediaQuery from '@components/media_query';
import prisma from "@root/lib/prisma"
import { motion, useAnimation, useViewportScroll, Variants } from "framer-motion"
import { FaCcStripe, FaInfo, FaStripe } from 'react-icons/fa';
import { HiLockClosed } from "react-icons/hi"
import BillingInput from '@components/billing_input';

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
    const router = useRouter();

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

        console.log(session);

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

    const updateBilling = (billing_info) => {
        setLocation({
            ...location,
            billing: billing_info,
            page: 2
        })
    }

	return (
		<div className="flex-col flex font-sans min-h-screen bg-white" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
            <div 
                className="fixed left-0 top-0 p-4 flex flex-row items-center gap-2 cursor-pointer text-violet-800"
                onClick={() => {
                    if(location.page > 0 && location.page <= 3) {
                        setLocation({ 
                            ...location,
                            //@ts-ignore
                            page: location.page - 1
                        })
                    }else {
                        window.history.go(-1);
                        // router.push("/profile")
                    }
                }}
            >
                <ArrowLeft strokeWidth={1}></ArrowLeft>
                <p>Go Back</p>
            </div>
            <div className="flex flex-col items-center sm:py-28 py-20 sm:gap-24 gap-12 mx-auto w-full max-w-6xl">
                <div className="flex flex-row items-center sm:gap-12 gap-8">
                    <div className={`flex flex-col items-center gap-2 ${location.page >= 0 ? "cursor-pointer" : "cursor-default"} `} onClick={() => {
                        if(location.page >= 0) {
                            setLocation({
                                ...location,
                                page: 0
                            });
                        }
                    }}>
                        <div className={`border-[3px] transition-all ${location.page > 0 ? "hover:border-violet-400 hover:text-violet-700" : "hover:border-transparent"} ${location.page == 0 ? "border-violet-800 bg-violet-100 text-violet-800" : "border-violet-200 bg-white text-violet-400"} rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl `}>{ location.page > 0 ? <Check /> : 1}</div>
                        <p className={`${location.page == 0 ? "text-violet-400" : "text-violet-300"} hidden sm:block`}>Choose A Plan</p>
                    </div>
                    <div className={`flex flex-col items-center gap-2 ${location.page >= 1 ? "cursor-pointer" : "cursor-default"} `} onClick={() => {
                        if(location.page >= 1) {
                            setLocation({
                                ...location,
                                page: 1
                            });
                        }
                    }}>
                        <div className={`border-[3px] transition-all ${location.page == 1 ? "border-violet-800 bg-violet-100" : "border-violet-200 bg-white"} rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl text-violet-800`}>{ location.page > 1 ? <Check /> : 2}</div>
                        <p className={`${location.page == 1 ? "text-violet-400" : "text-violet-300"} hidden sm:block`}>Billing Information</p>
                    </div>
                    <div className={`flex flex-col items-center gap-2 ${location.page >= 2 ? "cursor-pointer" : "cursor-default"}`} onClick={() => {
                        if(location.page >= 2) {
                            setLocation({
                                ...location,
                                page: 2
                            });
                        }
                    }}>
                        <div className={`border-[3px] transition-all ${location.page == 2 ? "border-violet-800 bg-violet-100" : "border-violet-200 bg-white"} rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl text-violet-800`}>{ location.page > 2 ? <Check /> : 3}</div>
                        <p className={`${location.page == 2 ? "text-violet-400" : "text-violet-300"} hidden sm:block`}>Usage Limits</p>
                    </div>
                    <div className={`flex flex-col items-center gap-2 ${location.page >= 2 ? "cursor-pointer" : "cursor-default"}`} onClick={() => {
                        if(location.page >= 3) {
                            setLocation({
                                ...location,
                                page: 3
                            });
                        }
                    }}>
                        <div className={`border-[3px] transition-all ${location.page == 3 ? "border-violet-800 bg-violet-100" : "border-violet-200 bg-white"} rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl text-violet-800`}>{ location.page > 3 ? <Check /> : 4}</div>
                        <p className={`${location.page == 3 ? "text-violet-400" : "text-violet-300"} hidden sm:block`}>Finish Setup</p>
                    </div>
                </div>

                <div className="flex flex-col gap-12">
                    {
                        (() => {
                            switch(location.page) {
                                case 0: 
                                    return (
                                        <>
                                            <div className="flex flex-col items-center gap-2">
                                                {
                                                    small ? 
                                                    <h1 className="font-bold text-4xl text-gray-800 text-center">Simple Pricing <br/>no commitment</h1>
                                                    :
                                                    <h1 className="font-bold text-5xl text-gray-800">Simple Pricing, no commitment</h1>
                                                }

                                                {
                                                    small ?
                                                    <></>
                                                    :
                                                    <div className="flex flex-row items-center gap-1">
                                                        <p className="text-gray-800 text-opacity-50">If you don{'\''}t exceed 5GB usage in a month, you don{'\''}t pay a thing!</p>
                                                    </div>
                                                }

                                            </div>
                                            
                                            <div className="flex md:flex-row flex-col items-center font-inter gap-8">
                                                <div className="bg-white rounded-xl border-[1px] border-gray-200" style={{ boxShadow: "rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 1px 1px 0px, rgb(60 66 87 / 0%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 6%) 0px 2px 5px 0px" }}>
                                                    <div className="flex-1 h-full min-h-full">
                                                        <div className="bg-white flex flex-col gap-4 rounded-xl p-6 text-gray-800 min-w-[350px]">
                                                            <div className="flex flex-col gap-1">
                                                                <h2 className="font-medium text-base">Free</h2>

                                                                <div className='flex flex-row items-center gap-4'>
                                                                    <p className="font-bold text-4xl font-sans">$0.00</p>
                                                                    <div className="flex flex-col items-start flex-1">
                                                                        <p className="font-normal text-sm">NZD/ mo</p>
                                                                        <p className="font-normal text-sm text-gray-800 text-opacity-80">$0.00 per GB</p>
                                                                    </div>
                                                                </div>

                                                                <p className="font-normal text-sm text-gray-800 text-opacity-80">Enjoy what reseda has to offer free, forever</p>
                                                            </div>

                                                            <div className="flex flex-col gap-1">
                                                                <div className='flex flex-row items-center font-sans'>
                                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                    <p className="text-gray-800 text-opacity-80">5GB/month</p>
                                                                </div>

                                                                <div className='flex flex-row items-center font-sans'>
                                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                    <p className="text-gray-800 text-opacity-80">50MB/s Maximum</p>
                                                                </div>

                                                                <div className='flex flex-row items-center font-sans'>
                                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                    <p className="text-gray-800 text-opacity-80">1 Device at a time</p>
                                                                </div>
                                                            </div>

                                                            {/* Check if it is a free tier and block access to the middle two elements! */}

                                                            <Button icon={<></>} onClick={() => {
                                                                setLocation({
                                                                    ...location,
                                                                    plan: "FREE",
                                                                    page: 3
                                                                })
                                                            }} className="bg-violet-100 text-violet-800 text-sm font-semibold py-[18px] hover:bg-violet-200">Go Free</Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-xl border-[1px] border-gray-200 relative" style={{ boxShadow: "rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 1px 1px 0px, rgb(60 66 87 / 0%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 6%) 0px 2px 5px 0px" }}>
                                                    <div className="absolute left-10 -top-4 flex items-center justify-center rounded-full bg-violet-600 px-4 py-[5px] text-sm text-white font-inter font-medium">Most Popular</div>
                                                    <div className="flex-1 h-full min-h-full">
                                                        
                                                        <div className="bg-white flex flex-col gap-6 rounded-xl flex-1 h-full min-h-full p-6 pt-8 text-gray-800 sm:w-full min-w-[350px]">
                                                            <div className="flex flex-col gap-2">
                                                                <h2 className="font-medium text-base">Basic</h2>

                                                                <div className='flex flex-row items-center gap-4'>
                                                                    <p className="font-bold text-4xl font-sans">$2.00</p>
                                                                    <div className="flex flex-col items-start flex-1 text-gray-800">
                                                                        <p className="font-normal text-sm">NZD/ 100GB</p>
                                                                        <p className="font-normal text-sm text-opacity-80">$0.02 per GB</p>
                                                                    </div>
                                                                </div>
                                                                
                                                                <p className="font-normal text-sm text-gray-800 text-opacity-80">Get the first 5GB free, and enjoy the benefits of a high speed VPN</p>
                                                            </div>

                                                            <div className="flex flex-col gap-1 text-gray-800">
                                                                <div className='flex flex-row items-center font-sans'>
                                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                    <p className="text-gray-800 text-opacity-80">Uncapped Usage</p>
                                                                </div>

                                                                <div className='flex flex-row items-center font-sans'>
                                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                    <p className="text-gray-800 text-opacity-80">500MB/s Maximum</p>
                                                                </div>

                                                                <div className='flex flex-row items-center font-sans'>
                                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                    <p className="text-gray-800 text-opacity-80">3 Device at a time</p>
                                                                </div>
                                                            </div>

                                                            <Button className="bg-violet-700 text-white text-sm font-semibold py-[18px]" onClick={() => {
                                                                setLocation({
                                                                    ...location,
                                                                    plan: "BASIC",
                                                                    page: 1
                                                                })
                                                            }}>Get Started</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                        
                                                <div className="bg-white rounded-xl border-[1px] border-gray-200" style={{ boxShadow: "rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 1px 1px 0px, rgb(60 66 87 / 0%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 6%) 0px 2px 5px 0px" }}>
                                                   <div className="flex-1 h-full min-h-full">
                                                        <div className="bg-white flex flex-col gap-4 rounded-xl p-6 text-gray-800 min-w-[350px]">
                                                            <div className="flex flex-col gap-1">
                                                                <h2 className="font-medium text-base">Pro</h2>

                                                                <div className='flex flex-row items-center gap-4'>
                                                                    <p className="font-bold text-4xl font-sans">$2.40</p>
                                                                    <div className="flex flex-col items-start flex-1">
                                                                        <p className="font-normal text-sm">NZD/ 100GB</p>
                                                                        <p className="font-normal text-sm text-gray-800 text-opacity-80">$0.024 per GB</p>
                                                                    </div>
                                                                </div>

                                                                <p className="font-normal text-sm text-gray-800 text-opacity-80">Enjoy 1GB/s speeds and your first 5GB free</p>
                                                            </div>

                                                            <div className="flex flex-col gap-1">
                                                                <div className='flex flex-row items-center font-sans'>
                                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                    <p className="text-gray-800 text-opacity-80">Uncapped Usage</p>
                                                                </div>

                                                                <div className='flex flex-row items-center font-sans'>
                                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                    <p className="text-gray-800 text-opacity-80">1GB/s Maximum</p>
                                                                </div>

                                                                <div className='flex flex-row items-center font-sans'>
                                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                    <p className="text-gray-800 text-opacity-80">Unlimited Device at a time</p>
                                                                </div>
                                                            </div>

                                                            <Button icon={<></>} className="bg-violet-100 text-violet-700 text-sm font-semibold py-[18px] hover:bg-violet-200" onClick={() => {
                                                                setLocation({
                                                                    ...location,
                                                                    plan: "PRO",
                                                                    page: 1
                                                                })
                                                            }}>Go Pro</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <br /><br />

                                            <div className="flex flex-col justify-center max-w-xl w-full m-auto gap-0">
                                                <h2 className="flex flex-row flex-1 w-full font-bold text-lg">FAQ</h2>
                                                <div className="flex flex-col">
                                                    <p>Worried about exceeding your budget?</p>
                                                    <p className="text-gray-500 text-sm">Don{"\'"}t worry! Our plans are flexible, you can set a budget or usage limit so you never spend more than you intend to!</p>
                                                </div>

                                                <br />

                                                <div className="flex flex-col">
                                                    <p>Could my speeds be lower than advertised?</p>
                                                    <p className="text-gray-500 text-sm">Quite possibly, yes. Your speeds are made from numerous factors such as your personal internet speed, distance from server, ISP throttling, and the load of the server. Thats why our speeds are advertised as a maximum.</p>
                                                </div>
                                                
                                                <br />
                                                
                                                <div className="flex flex-col">
                                                    <p>Can I change my plan later?</p>
                                                    <p className="text-gray-500 text-sm">Absolutely! You can change your plan anytime. If you change a paid plan to a free one before using your first 5GB you wont have to pay a thing.</p>
                                                </div>
                                            </div>
                                        </>
                                    )
                                case 1:
                                    return (
                                        <>
                                            <div className="flex flex-col items-center gap-2">
                                                {
                                                    small ? 
                                                    <h1 className="font-bold text-4xl text-gray-800 text-center">Billing</h1>
                                                    :
                                                    <h1 className="font-bold text-5xl text-gray-800">Billing</h1>
                                                }

                                                {
                                                    small ?
                                                    <></>
                                                    :
                                                    <div className="flex flex-row items-center gap-1">
                                                        <p className="text-gray-800 text-opacity-50">For paid plans, we require credit card information.</p>
                                                    </div>
                                                }
                                            </div>

                                            <div>
                                                <BillingInput autofill={location.billing} locationCallback={updateBilling} />
                                            </div>

                                            <div className="flex flex-row items-center gap-2 bg-violet-100 rounded-md px-3 py-2">
                                                {/* <FaCcStripe size={28} className="text-violet-800"></FaCcStripe> */}
                                                <HiLockClosed color='#5B21B6'></HiLockClosed>
                                                <p className="text-violet-800">Your information is stored securely with stripe.</p>
                                            </div>
                                        </>
                                    )
                                case 2:
                                    return <>C</>
                                case 3:
                                    return <></>
                            }
                        })()
                    }
                </div>
            </div>
        </div>
	)
}