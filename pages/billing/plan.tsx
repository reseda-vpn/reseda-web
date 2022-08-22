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
import { FaCcStripe, FaStripe } from 'react-icons/fa';


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

    const [ location, setLocation ] = useState<{
        page: 0 | 1 | 2 | 3,
        plan: "FREE" | "PRO" | "BASIC"
    }>({
        page: 0,
        plan: null
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
                className="fixed left-0 top-0 p-4 flex flex-row items-center gap-2 cursor-pointer text-violet-800"
                onClick={() => {
                    if(location.page >= 0 && location.page <= 3) {
                        setLocation({ 
                            ...location,
                            //@ts-ignore
                            page: location.page - 1
                        })
                    }else {
                        router.push("/profile")
                    }
                }}
            >
                <ArrowLeft strokeWidth={1}></ArrowLeft>
                <p>Go Back</p>
            </div>
            <div className="flex flex-col items-center py-28 gap-24 mx-auto w-full max-w-6xl">
                <div className="flex flex-row items-center gap-12">
                    <div className={`flex flex-col items-center gap-2 ${location.page >= 0 ? "cursor-pointer" : "cursor-default"} `} onClick={() => {
                        if(location.page >= 0) {
                            setLocation({
                                ...location,
                                page: 0
                            });
                        }
                    }}>
                        <div className={`border-[3px] transition-all ${location.page > 0 ? "hover:border-violet-400 hover:text-violet-700" : "hover:border-transparent"} ${location.page == 0 ? "border-violet-800 bg-violet-100 text-violet-800" : "border-violet-200 bg-white text-violet-400"} rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl `}>1</div>
                        <p className={`${location.page == 0 ? "text-violet-400" : "text-violet-300"}`}>Choose A Plan</p>
                    </div>
                    <div className={`flex flex-col items-center gap-2 ${location.page >= 1 ? "cursor-pointer" : "cursor-default"} `} onClick={() => {
                        if(location.page >= 1) {
                            setLocation({
                                ...location,
                                page: 1
                            });
                        }
                    }}>
                        <div className={`border-[3px] transition-all ${location.page == 1 ? "border-violet-800 bg-violet-100" : "border-violet-200 bg-white"} rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl text-violet-800`}>2</div>
                        <p className={`${location.page == 1 ? "text-violet-400" : "text-violet-300"}`}>Billing Information</p>
                    </div>
                    <div className={`flex flex-col items-center gap-2 ${location.page >= 2 ? "cursor-pointer" : "cursor-default"}`} onClick={() => {
                        if(location.page >= 2) {
                            setLocation({
                                ...location,
                                page: 2
                            });
                        }
                    }}>
                        <div className={`border-[3px] transition-all ${location.page == 2 ? "border-violet-800 bg-violet-100" : "border-violet-200 bg-white"} rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl text-violet-800`}>3</div>
                        <p className={`${location.page == 2 ? "text-violet-400" : "text-violet-300"}`}>Usage Limits</p>
                    </div>
                    <div className={`flex flex-col items-center gap-2 ${location.page >= 2 ? "cursor-pointer" : "cursor-default"}`} onClick={() => {
                        if(location.page >= 3) {
                            setLocation({
                                ...location,
                                page: 3
                            });
                        }
                    }}>
                        <div className={`border-[3px] transition-all ${location.page == 3 ? "border-violet-800 bg-violet-100" : "border-violet-200 bg-white"} rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl text-violet-800`}>4</div>
                        <p className={`${location.page == 3 ? "text-violet-400" : "text-violet-300"}`}>Finish Setup</p>
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
                                                <h1 className="font-bold text-5xl text-violet-800">Simple Pricing, no commitment</h1>

                                                <div className="flex flex-row items-center gap-1">
                                                    <p className="text-violet-400">If you don{'\''}t exceed 5GB usage in a month, you don{'\''}t pay a thing!</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-row items-center font-inter">
                                                <div className="py-5">
                                                    <div className="bg-violet-600 flex flex-col gap-4 rounded-lg rounded-r-none p-6 text-white min-w-[350px]">
                                                        <div className="flex flex-col gap-1">
                                                            <h2 className="font-medium text-base">Free</h2>

                                                            <div className='flex flex-row items-center gap-4'>
                                                                <p className="font-bold text-4xl font-sans">$0.00</p>
                                                                <div className="flex flex-col items-start flex-1">
                                                                    <p className="font-normal text-sm">NZD/ mo</p>
                                                                    <p className="font-normal text-sm text-gray-200 text-opacity-80">$0.00 per GB</p>
                                                                </div>
                                                            </div>

                                                            <p className="font-normal text-sm text-gray-200 text-opacity-80">Enjoy what reseda has to offer free, forever</p>
                                                        </div>

                                                        <div className="flex flex-col gap-1">
                                                            <div className='flex flex-row items-center font-sans'>
                                                                <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#fff"} /></div>
                                                                <p className="font-light">5GB/month</p>
                                                            </div>

                                                            <div className='flex flex-row items-center font-sans'>
                                                                <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#fff"} /></div>
                                                                <p className="font-light">50MB/s Maximum</p>
                                                            </div>

                                                            <div className='flex flex-row items-center font-sans'>
                                                                <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#fff"} /></div>
                                                                <p className="font-light">1 Device at a time</p>
                                                            </div>
                                                        </div>

                                                        {/* Check if it is a free tier and block access to the middle two elements! */}

                                                        <Button icon={<></>} onClick={() => {
                                                            setLocation({
                                                                plan: "FREE",
                                                                page: 3
                                                            })
                                                        }} className="bg-white text-violet-800 text-sm font-semibold py-[18px]">Go Free</Button>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-white rounded-lg border-[3px] border-violet-600">
                                                    <div className="bg-white flex flex-col gap-4 rounded-lg flex-1 h-full min-h-full p-6 text-violet-800 w-full min-w-[350px]">
                                                        <div className="flex flex-col gap-1">
                                                            <h2 className="font-medium text-base">Basic</h2>

                                                            <div className='flex flex-row items-center gap-4'>
                                                                <p className="font-bold text-4xl font-sans">$2.00</p>
                                                                <div className="flex flex-col items-start flex-1 text-gray-800">
                                                                    <p className="font-normal text-sm">NZD/ 100GB</p>
                                                                    <p className="font-normal text-sm text-opacity-80">$0.02 per GB</p>
                                                                </div>
                                                            </div>

                                                            <p className="text-gray-500">Get the first 5GB free, and enjoy the benefits of a high speed VPN</p>
                                                        </div>

                                                        <div className="flex flex-col gap-1 text-gray-800">
                                                            <div className='flex flex-row items-center font-sans'>
                                                                <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                <p className="font-medium">Uncapped Usage</p>
                                                            </div>

                                                            <div className='flex flex-row items-center font-sans'>
                                                                <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                <p className="font-medium">500MB/s Maximum</p>
                                                            </div>

                                                            <div className='flex flex-row items-center font-sans'>
                                                                <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#5B21B6"} /></div>
                                                                <p className="font-medium">3 Device at a time</p>
                                                            </div>
                                                        </div>

                                                        <Button className="bg-violet-700 text-white text-sm font-semibold py-[18px]" onClick={() => {
                                                            setLocation({
                                                                plan: "BASIC",
                                                                page: 1
                                                            })
                                                        }}>Get Started</Button>
                                                    </div>
                                                </div>

                                                <div className="py-5">
                                                    <div className="bg-violet-600 flex flex-col gap-4 rounded-lg rounded-l-none p-6 text-white min-w-[350px]">
                                                        <div className="flex flex-col gap-1">
                                                            <h2 className="font-medium text-base">Pro</h2>

                                                            <div className='flex flex-row items-center gap-4'>
                                                                <p className="font-bold text-4xl font-sans">$2.40</p>
                                                                <div className="flex flex-col items-start flex-1">
                                                                    <p className="font-normal text-sm">NZD/ 100GB</p>
                                                                    <p className="font-normal text-sm text-gray-200 text-opacity-80">$0.024 per GB</p>
                                                                </div>
                                                            </div>

                                                            <p className="font-normal text-sm text-gray-200 text-opacity-80">Enjoy 1GB/s speeds and your first 5GB free</p>
                                                        </div>

                                                        <div className="flex flex-col gap-1">
                                                            <div className='flex flex-row items-center font-sans'>
                                                                <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#fff"} /></div>
                                                                <p className="font-light">Uncapped Usage</p>
                                                            </div>

                                                            <div className='flex flex-row items-center font-sans'>
                                                                <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#fff"} /></div>
                                                                <p className="font-light">1GB/s Maximum</p>
                                                            </div>

                                                            <div className='flex flex-row items-center font-sans'>
                                                                <div className="h-8 w-8 rounded-full flex items-center justify-center"><Check size={18} color={"#fff"} /></div>
                                                                <p className="font-light">Unlimited Device at a time</p>
                                                            </div>
                                                        </div>

                                                        <Button icon={<></>} className="bg-white text-violet-700 text-sm font-semibold py-[18px]" onClick={() => {
                                                            setLocation({
                                                                plan: "PRO",
                                                                page: 1
                                                            })
                                                        }}>Go Pro</Button>
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
                                                    <p className="text-gray-500 text-sm">Your speeds are made from numerous factors such as your personal internet speed, distance from server, ISP throttling, and the load of the server. Thats why our speeds are advertised as a maximum!</p>
                                                </div>
                                            </div>
                                        </>
                                    )
                                case 1:
                                    return (
                                        <>
                                            <div className="flex flex-col items-center gap-2">
                                                <h1 className="font-bold text-5xl text-violet-800">Billing</h1>

                                                <div className="flex flex-row items-center gap-1">
                                                    <p className="text-violet-400">For paid plans, we require credit card information.</p>
                                                </div>
                                            </div>

                                            <div>

                                            </div>

                                            <div className="flex flex-row items-center gap-2 bg-violet-100 rounded-md px-3 py-2">
                                                <FaCcStripe size={28} className="text-violet-800"></FaCcStripe>
                                                <p>Your information is stored securely with stripe.</p>
                                            </div>
                                        </>
                                    )
                                case 2:
                                    return <>C</>
                            }
                        })()
                    }
                </div>
            </div>
        </div>
	)
}