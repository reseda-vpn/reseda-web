import { useEffect, useState } from 'react';
import { Gradient } from '@components/gradient'
import { useRouter } from 'next/router';
import { Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, CreditCard, Delete, Download, Edit, Eye, Info, Lock, LogOut, Settings, Trash, User as UserIcon, X } from 'react-feather';

import { useSession, getSession, signIn, signOut, getCsrfToken } from "next-auth/react"
import { Account, Usage, User } from '@prisma/client';
import Button from '@components/un-ui/button';
import useMediaQuery from '@components/media_query';
import prisma from "@root/lib/prisma"
import { HiExclamation, HiLockClosed } from "react-icons/hi"
import BillingInput from '@components/billing_input';
import { loadStripe } from '@stripe/stripe-js';
import {
    useStripe,
    useElements,
    CardNumberElement,
  } from '@stripe/react-stripe-js';
import Loader from './un-ui/loader';
import { FaFileInvoice } from 'react-icons/fa';

const stripePromise = loadStripe('pk_test_51KHl5DFIoTGPd6E4i9ViGbb5yHANKUPdzKKxAMhzUGuAFpVFpdyvcdhBSJw2zeN0D4hjUvAO1yPpKUUttHOTtgbv00cG1fr4Y5');

const CheckoutForm: React.FC<{ ss_session, user, }> = ({ ss_session, user, }) => {
    const session = useSession(ss_session);
	const small = useMediaQuery(640);

    const stripe = useStripe();
    const elements = useElements();

    const [ userInformation, setUserInformation ] = useState<Account>(null);
    const [ usageInformation, setUsageInformation ] = useState<Usage[]>(null);

    const [ processing, setProcessing ] = useState(false);

    const [ location, setLocation ] = useState<{
        page: 0 | 1 | 2 | 3,
        plan: "FREE" | "PRO" | "BASIC",
        paid: boolean,
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
        paid: false,
        billing: {
            card_number: null,
            card_date: null,
            cvv: null,

            billing_address: null,
            zip_code: null
        }
    });

    const [ invoiceUrl, setInvoiceUrl ] = useState(null);
    const [ hasExistingPaymentMethod, setHasExistingPaymentMethod ] = useState(false);

	useEffect(() => {
        localStorage.setItem("reseda.jwt", JSON.stringify(ss_session?.jwt));

        setUserInformation(user.accounts[0]);

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

    useEffect(() => {
        if(!userInformation) return;

        // Check if user has existing payment methods we can bill instead, skipping billing step.
        const newPlan = fetch("/api/billing/get-payment-methods", {
            body: JSON.stringify({ 
                customerId: userInformation.billing_id,
            }),
            method: 'POST'
        }).then(async e => {
            const json = await e.json();

            if(json.data.length > 0) {
                setHasExistingPaymentMethod(true)
            }
        });

    }, [userInformation])

    const updateBilling = () => {
        console.log("Billing Updated, processing payment...")

        processPayment();
    }

    const complete = () => {
        // Set the new role
        setLocation({
            ...location,
            page: 3,
            paid: true
        });

        setProcessing(false);
    }

    const processPayment = async (plan?) => {
        console.log(`Treating for plan: ${location.plan}`);

        setProcessing(true)

        setLocation({
            ...location,
            page: 2
        });

        if(plan == "FREE") {
            setLocation({
                ...location,
                plan: "FREE"
            });

            console.log("Loading for FREE Tier");

            const subsc = await fetch('/api/billing/create-subscription', {
                body: JSON.stringify({ 
                    customerId: userInformation.billing_id,
                    customerEmail: session.data.user.email,
                    tier: "FREE",
                }),
                method: 'POST'
            }).then(async e => {
                return await e.json();
            });

            console.log(subsc);

            const change = await fetch("/api/billing/change-plan", {
                body: JSON.stringify({ 
                    newPlan: "FREE",
                    userId: userInformation.id,
                    subscriptionId: "N/A"
                }),
                method: 'POST'
            }).then(async e => {
                return await e.json();
            });

            console.log(change);

            complete();
            return;
        }

        const price_id = (() => {
            switch(location.plan) {
                case "PRO":     
                    return 'price_1LlJ1MFIoTGPd6E49kkFeEoN' // Test Mode
                    // return 'price_1LU24tFIoTGPd6E4Pnx9I5be' // Live Mode
                case "BASIC":
                    return 'price_1LrzQrFIoTGPd6E4DioqkHNd' // Test Mode
                    // return 'price_1LU1noFIoTGPd6E4q7rBXREN' // Live Mode
            }
        })();

        const subscription: void | { subscriptionId: string, clientSecret: string, invoiceId: string, invoiceURL: string } = await fetch('/api/billing/create-subscription', {
            body: JSON.stringify({ 
                customerId: userInformation.billing_id,
                priceId: price_id,
                tier: location.plan,
                customerEmail: session.data.user.email
            }),
            method: 'POST'
        }).then(async e => {
            return await e.json();
        });

        if(!subscription) {
            console.error("Unable to create stripe subscription.", subscription);
            return;
        }

        setInvoiceUrl(subscription.invoiceURL);

        if(hasExistingPaymentMethod){
            await fetch("/api/billing/change-plan", {
                body: JSON.stringify({ 
                    newPlan: location.plan,
                    userId: userInformation.id,
                    subscriptionId: subscription.subscriptionId
                }),
                method: 'POST'
            }).then(async e => {
                return await e.json();
            });

            complete();
        }else {
            stripe.confirmCardSetup(subscription.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: session.data.user.name
                    },
                }
            }).then(async e => {
                await fetch("/api/billing/change-plan", {
                    body: JSON.stringify({ 
                        newPlan: location.plan,
                        userId: userInformation.id,
                        subscriptionId: subscription.subscriptionId
                    }),
                    method: 'POST'
                }).then(async e => {
                    return await e.json();
                });
    
                complete();
            })
        }
    }

	return (
		<div className="flex-col flex font-sans min-h-screen bg-white" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
            {
                processing ? 
                <div
                    className="fixed w-screen h-screen flex items-center justify-center bg-gray-600 bg-opacity-25 backdrop-blur-sm flex-col gap-4 z-50"
                    >
                    <div className="bg-white rounded-3xl p-7 flex flex-col items-center gap-8">
                        <Loader color={"#0c0c0c"} height={80}/>

                    </div>

                    <div className="bg-white rounded-lg px-3 py-1">
                        <p className="font-bold">Processing Payment</p>
                    </div>
                </div>
                :
                <></>
            }

            <div 
                className={`fixed left-2 p-4 flex flex-row items-center gap-2 cursor-pointer text-violet-800 z-50 bg-white rounded-lg px-4 py-2 top-2 ${processing ? "!text-violet-400 hidden" : ""}`}
                onClick={async () => {
                    if(processing) return;

                    if(location.page > 0 && location.page <= 3 && !location.paid) {
                        setLocation({ 
                            ...location,
                            //@ts-ignore
                            page: location.page - 1
                        })
                    }else if(!location.paid) {
                        window.history.go(-1);
                    }else if(location.paid) {
                        window.location.href = "../profile"
                    }
                }}
            >
                <ArrowLeft strokeWidth={1}></ArrowLeft>
                <p>
                    {
                        location.paid ? 
                        "Profile"
                        :
                        "Go Back"
                    }
                </p>
            </div>
            <div className="flex flex-col items-center sm:py-28 py-20 sm:gap-24 gap-12 mx-auto w-full max-w-6xl">
                <div className="flex flex-row items-center sm:gap-12 gap-8">
                    <div className={`flex flex-col items-center gap-2 ${location.page >= 0 ? "cursor-pointer" : "cursor-default"} `} onClick={() => {
                        if(location.page >= 0 && !location.paid) {
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
                        if(location.page >= 1 && location.plan !== "FREE" && !location.paid) {
                            setLocation({
                                ...location,
                                page: 1
                            });
                        }
                    }}>
                        <div className={`border-[3px] transition-all ${location.page == 1 ? "border-violet-800 bg-violet-100" : "border-violet-200 bg-white"} ${location.page > 1 ? "hover:border-violet-400 hover:text-violet-700" : ""} rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl text-violet-800`}>{ location.page > 1 ? <Check /> : 2}</div>
                        <p className={`${location.page == 1 ? "text-violet-400" : "text-violet-300"} hidden sm:block`}>Usage Limits</p>
                    </div>
                    <div className={`flex flex-col items-center gap-2 ${location.page >= 2 ? "cursor-pointer" : "cursor-default"}`} onClick={() => {
                        if(location.page >= 2 && location.plan !== "FREE" && !location.paid) {
                            setLocation({
                                ...location,
                                page: 2
                            });
                        }
                    }}>
                        <div className={`border-[3px] transition-all ${location.page == 2 ? "border-violet-800 bg-violet-100" : "border-violet-200 bg-white"} ${location.page > 2 ? "hover:border-violet-400 hover:text-violet-700" : ""} rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl text-violet-800`}>{ location.page > 2 ? <Check /> : 3}</div>
                        <p className={`${location.page == 2 ? "text-violet-400" : "text-violet-300"} hidden sm:block`}>Billing Information</p>
                    </div>
                    <div className={`flex flex-col items-center gap-2 ${location.page >= 3 ? "cursor-pointer" : "cursor-default"}`} onClick={() => {
                        if(location.page >= 3) {
                            setLocation({
                                ...location,
                                page: 3
                            });
                        }
                    }}>
                        <div className={`border-[3px] transition-all ${location.page == 3 ? "border-violet-800 bg-violet-100" : "border-violet-200 bg-white"} rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl text-violet-800`}>{ location.page > 3 ? <Check /> : 4}</div>
                        <p className={`${location.page == 3 ? "text-violet-400" : "text-violet-300"} hidden sm:block`}>Completed</p>
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
                                            
                                            <div className="flex items-center justify-center w-full gap-4">
                                                <div className=" bg-violet-200 flex flex-row items-center gap-4 pl-4 rounded-lg overflow-hidden"> {/* bg-[#d7f7c2] */}
                                                    <p className=" text-violet-600">Active Plan </p> {/* text-[#006908] */}
                                                    <p className="px-4 py-2 bg-violet-600 text-white ">{userInformation?.tier?.toLowerCase()?.split("")?.[0]?.toUpperCase() + userInformation?.tier?.substring(1, userInformation?.tier?.length)?.toLowerCase()}</p>
                                                </div>
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
                                                                if(userInformation.tier == "FREE") return;

                                                                setLocation({
                                                                    ...location,
                                                                    plan: "FREE",
                                                                    page: 1
                                                                })
                                                            }} className={`bg-violet-100 text-violet-800 text-sm font-semibold py-[18px] hover:bg-violet-200 select-none ${userInformation?.tier == "FREE" ? "bg-violet-100 text-violet-300 hover:!bg-violet-100 hover:!cursor-default" : ""}`}>
                                                                {
                                                                    (() => {
                                                                        switch(userInformation?.tier) {
                                                                            case "FREE":
                                                                                return "Already Selected" 
                                                                            case "BASIC":
                                                                                return "Go Free" 
                                                                            case "SUPPORTER":
                                                                                return "Revert to Free" 
                                                                            case "PRO":
                                                                                return "Go Free" 
                                                                            default:
                                                                                return "Go Free" 
                                                                        }
                                                                    })()
                                                                }
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-xl border-[1px] border-gray-200 relative" style={{ boxShadow: "rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 1px 1px 0px, rgb(60 66 87 / 0%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 6%) 0px 2px 5px 0px" }}>
                                                    <div className="absolute left-10 -top-4 flex items-center justify-center rounded-full bg-violet-600 px-4 py-[5px] text-sm text-white font-inter font-medium">Most Popular</div>
                                                    <div className="flex-1 h-full min-h-full">
                                                        <div className="bg-white flex flex-col gap-6 rounded-xl p-6 pt-8 text-gray-800 min-w-[350px]">
                                                            <div className="flex flex-col gap-2">
                                                                <h2 className="font-medium text-base">Basic</h2>

                                                                <div className='flex flex-row items-center gap-4'>
                                                                    <p className="font-bold text-4xl font-sans">$2.00</p>
                                                                    <div className="flex flex-col items-start flex-1 text-gray-800">
                                                                        <p className="font-normal text-sm">NZD/ 100GB</p>
                                                                        <p className="font-normal text-sm text-opacity-80">$0.02 per GB</p>
                                                                    </div>
                                                                </div>
                                                                
                                                                <p className="font-normal text-sm text-gray-800 text-opacity-80">Get the first 5GB free, <br />and enjoy the benefits of a high speed VPN</p>
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

                                                            <Button icon={userInformation?.tier !== "BASIC" ? <ArrowRight size={16} /> : false} className={`bg-violet-700 text-white text-sm font-semibold py-[18px] select-none ${userInformation?.tier == "BASIC" ? "!bg-violet-100 text-violet-300 hover:!bg-violet-100 hover:!cursor-default" : ""}`} onClick={() => {
                                                                if(userInformation.tier == "BASIC") return;

                                                                setLocation({
                                                                    ...location,
                                                                    plan: "BASIC",
                                                                    page: 1
                                                                })
                                                            }}>
                                                                {
                                                                    (() => {
                                                                        switch(userInformation?.tier) {
                                                                            case "FREE":
                                                                                return "Get Started" 
                                                                            case "BASIC":
                                                                                return "Already Selected" 
                                                                            case "SUPPORTER":
                                                                                return "Get Started" 
                                                                            case "PRO":
                                                                                return "Switch to Basic" 
                                                                            default:
                                                                                return "Get Started" 
                                                                        }
                                                                    })()
                                                                }
                                                            </Button>
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

                                                            <Button icon={<></>} className={`bg-violet-100 text-violet-700 text-sm font-semibold py-[18px] hover:bg-violet-200 select-none ${userInformation?.tier == "PRO" ? "bg-violet-100 text-violet-300 hover:!bg-violet-100 hover:!cursor-default" : ""}`} onClick={() => {
                                                                if(userInformation.tier == "PRO") return;
                                                                
                                                                setLocation({
                                                                    ...location,
                                                                    plan: "PRO",
                                                                    page: 1
                                                                })
                                                            }}>
                                                                {
                                                                    (() => {
                                                                        switch(userInformation?.tier) {
                                                                            case "FREE":
                                                                                return "Go Pro" 
                                                                            case "BASIC":
                                                                                return "Switch to Pro" 
                                                                            case "SUPPORTER":
                                                                                return "Go Pro" 
                                                                            case "PRO":
                                                                                return "Already Selected" 
                                                                            default:
                                                                                return "Go Pro" 
                                                                        }
                                                                    })()
                                                                }
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <br /><br />

                                            <div className="flex flex-col justify-center max-w-xl w-full m-auto gap-0 px-8">
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
                                        <div className="flex flex-col items-center gap-2">
                                            {
                                                small ? 
                                                <h1 className="font-bold text-4xl text-gray-800 text-center">Usage Limits</h1>
                                                :
                                                <h1 className="font-bold text-5xl text-gray-800">Usage Limits</h1>
                                            }

                                            {
                                                small ?
                                                <></>
                                                :
                                                <div className="flex flex-row items-center gap-1">
                                                    <p className="text-gray-800 text-opacity-50">Set usage limits so you never use more than you intend to</p>
                                                </div>
                                            }

                                            <br />


                                            <div className="w-full relative">
                                                <div className="absolute h-full w-full flex items-center justify-center">
                                                    <p className="z-50 font-bold text-gray-800">Feature releasing soon</p>

                                                </div>

                                                <div className='blur-md w-full min-w-full h-6 '>
                                                    <div className="w-4 h-6 bg-violet-600 rounded-b-full rounded-t-md"></div>
                                                </div>
                                                <div className="blur-md w-full min-w-full h-8 rounded-lg overflow-hidden flex flex-row items-center">
                                                    <div className="bg-gray-200 w-full h-full border-1 rounded-lg rounded-r-none border-gray-700"></div>
                                                    <div className="bg-white w-[1px] h-full rounded-none"></div>
                                                    <div className="bg-violet-500 w-[50%] h-full border-1 rounded-lg rounded-l-none border-violet-700"></div>
                                                </div>
                                            </div>

                                            <br />

                                            <div className="flex flex-col gap-0 items-center justify-center">
                                                <Button className="text-gray-800 text-opacity-80 leading-3" onClick={() => {
                                                    if(hasExistingPaymentMethod) {
                                                        setLocation({
                                                            ...location,
                                                            page: 3
                                                        });

                                                        processPayment();
                                                    }else {
                                                        setLocation({
                                                            ...location,
                                                            page: 2
                                                        })  
                                                    }
                                                }}>
                                                    Skip this step
                                                </Button>
                                                <p className="text-gray-800 text-opacity-50 text-sm">You can always set a limit later in settings.</p>
                                            </div>
                                        </div>
                                    )
                                case 2:
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

                                                <p>Subscribing to <strong className="text-orange-600">{location.plan}</strong></p>
                                            </div>

                                            {/* <p onClick={() => {
                                                setLocation({
                                                    ...location,
                                                    page: 3,
                                                    paid: true
                                                })
                                            }}>next</p> */}
                                            
                                            <div className="flex flex-col items-center w-full gap-4 px-4">
                                                <div className="flex flex-col gap-6 w-full">
                                                    <BillingInput locationCallback={updateBilling} />
                                                </div>

                                                <br />

                                                {/* <p className="text-gray-700">By proceeding, you consent to stripe saving this card.</p> */}

                                                <div className="flex flex-row items-center gap-2 bg-violet-100 rounded-md px-3 py-2">
                                                    {/* <FaCcStripe size={28} className="text-violet-800"></FaCcStripe> */}
                                                    <HiLockClosed color='#5B21B6'></HiLockClosed>
                                                    <p className="text-violet-800">Your information is stored securely with stripe.</p>
                                                </div>
                                            </div>
                                            
                                        </>
                                    )
                                case 3:
                                    return (
                                        <>
                                            <div className="flex flex-col items-center gap-2">
                                                {
                                                    small ? 
                                                    <h1 className="font-bold text-4xl text-gray-800 text-center">Thank You!</h1>
                                                    :
                                                    <h1 className="font-bold text-5xl text-gray-800">Thank You!</h1>
                                                }

                                                {
                                                    <div className="flex flex-row items-center gap-1">
                                                        <p className="text-gray-800 text-opacity-50">You have subscribed to <strong className="text-orange-600">{location.plan}</strong></p>
                                                    </div>
                                                }
                                            </div>

                                            <div className="flex flex-row items-center justify-center gap-4 w-full">
                                                    {
                                                        invoiceUrl !== "FREE" ?   
                                                        <Button onClick={() => {
                                                            window.open(invoiceUrl)
                                                        }} href={`#${invoiceUrl}`} icon={<FaFileInvoice />} className={`bg-violet-700 text-white !static`}>View my Invoice</Button>
                                                        :
                                                        <></>
                                                    }
                                                    
                                                    <Button href="../profile" className="block !static">Go to profile</Button>
                                                </div>

                                            <div className="flex flex-col items-baseline gap-6 justify-start px-8 sm:px-0">
                                                {
                                                    small ?
                                                    <>
                                                        <p className="text-gray-800 self-center font-bold text-lg">What can I do now?</p>
                                                    </>
                                                    :
                                                    <>
                                                        <h2 className="text-gray-800 self-center">You now have access everything the {location.plan} tier offers!</h2>
                                                        <h2 className="text-gray-500">Begin by doing the following</h2>
                                                    </>
                                                }

                                                <div className="flex flex-row items-center gap-6">
                                                    <div className="flex items-center justify-center p-4 rounded-full border-2 bg-violet-200 border-violet-400 text-violet-800 h-8 w-8 font-bold text-lg">
                                                        1
                                                    </div>

                                                    <div>
                                                        <p className="font-bold">Download</p>
                                                        <p>Haven{'\''}t downloaded reseda? download it <a href="../download" className="text-violet-700">here</a></p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-row items-center gap-6">
                                                    <div className="flex items-center justify-center p-4 rounded-full border-2 bg-violet-200 border-violet-400 text-violet-800 h-8 w-8 font-bold text-lg">
                                                        2
                                                    </div>

                                                    <div>
                                                        <p className="font-bold">Set Limits</p>
                                                        <p>If you didn{'\''}t previously, you can set limits <a href="../profile" className="text-violet-700">here</a></p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-row items-center gap-6">
                                                    <div className="flex items-center justify-center p-4 rounded-full border-2 bg-violet-200 border-violet-400 text-violet-800 h-8 w-8 font-bold text-lg">
                                                        3
                                                    </div>

                                                    <div>
                                                        <p className="font-bold">View your usage</p>
                                                        <p>You can track your usage to monitor your billing <a href="../profile" className="text-violet-700">here</a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                            }
                        })()
                    }
                </div>
            </div>
        </div>
	)
}

export default CheckoutForm;