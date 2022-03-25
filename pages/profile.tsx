import { useEffect, useMemo, useRef, useState } from 'react';
import { Gradient } from '@components/gradient'
import { supabase } from '@root/client';
import { useRouter } from 'next/router';
import Header from '@components/header';
import { Activity, ArrowDown, ArrowUp, ArrowUpRight, Check, CreditCard, Download, Settings, User as UserIcon } from 'react-feather';

import { useSession, getSession, signIn, signOut, getCsrfToken } from "next-auth/react"
import { Account, Usage, User } from '@prisma/client';
import Button from '@components/un-ui/button';
import useMediaQuery from '@components/media_query';
import Loader from '@components/un-ui/loader';
import Chart from '@components/chart';
import prisma from "@root/lib/prisma"

export const getServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });
    const csrfToken = await getCsrfToken({ req: req });

    if (!session) return { props: {}, redirect: { destination: '/login', permanent: false } }
    console.log(session, csrfToken);

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
    const [ eligibleForDownload, setEligibleForDownload ] = useState<0 | 1 | 2>(0); // 0 is not returned, 1 is true, 2 is false.
    const [ usageInformation, setUsageInformation ] = useState<Usage[]>(null);
    const [ menu, setMenu ] = useState("account");
    const router = useRouter();

	useEffect(() => {
        setUserInformation(user.accounts[0]);
        setEligibleForDownload(eligible.claimable ? 1 : 2);
        // setUsageInformation(usage);

        // Create your instance
        const gradient = new Gradient()

        if(session.status !== "authenticated") router.push('./login');

        //@ts-expect-error
        gradient.initGradient('#gradient-canvas');

        const as = async () => {
            
            // if(!userInformation) 
            //     fetch(`/api/user/${session?.data?.user?.email}`).then(async e => {
            //         const data = await e.json();
            //         setUserInformation(data.accounts[0]);
            //     });
            
            // if(eligibleForDownload == 0) 
            //     fetch(`/api/lead/email/${session?.data?.user?.email}`).then(async e => {
            //         const data = await e.json();

            //         setEligibleForDownload(data.type == "eligible" ? 1 : 2);
            //     });

            fetch(`/api/user/usage/${user.accounts[0].userId}`).then(async e => {
                    const data = await e.json();
                    setUsageInformation(data);
                });
        }

        if(session.status == "authenticated") as();    
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, router]);

    const data = usageInformation?.map(e => {
        return {
            key: new Date(e.connEnd),
            first: parseInt(e.up),
            second: parseInt(e.down)
        }
    }) ?? []

	return (
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<div className="flex-col flex font-sans min-h-screen w-screen relative overflow-hidden">
                {
                    small ? 
                    <div className="overflow-hidden relative">
                        <Header />
                        <canvas id="gradient-canvas" className="top-0 sm:h-64 h-12" data-transition-in></canvas> {/*  style={{ height: small ? '50px !important' : '250px !important' }} */}
                    </div>
                    :
                    <>
                        <Header />
                        <canvas id="gradient-canvas" className="top-0 sm:h-64 h-12" data-transition-in></canvas> {/*  style={{ height: small ? '50px !important' : '250px !important' }} */}
                    </>
                }
                

                <div className="flex flex-col sm:flex-row px-4 max-w-screen-lg w-full my-0 mx-auto z-50 h-full flex-1 gap-8 py-4 sm:mt-64" > {/* style={{ marginTop: '250px', marginBottom: '50px' }} */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:w-32 w-full">
                        <div className="flex flex-row sm:flex-col gap-2 w-full">
                            {/* <p className="font-normal text-sm text-slate-600 sm:flex hover:text-slate-800">Account</p> */}
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "account" ? "bg-violet-500 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("account")} >{ <UserIcon size={16}/>  } Account</p>
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "usage" ? "bg-violet-500 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("usage")}>{ <Activity size={16}/>  } Usage</p>
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "billing" ? "bg-violet-500 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("billing")}>{ <CreditCard size={16}/>  } Billing</p>
                        </div>

                        <div className="flex flex-col gap-2 w-full"> {/* height: 32px; align-items: center; justify-content: center; */}
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 h-8 content-center ${menu == "settings" ? "bg-violet-500 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("settings")}>{ <Settings size={16}/>  } {small ? "" : "Settings"}</p>
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 w-full">
                        {
                            (() => {
                                switch(menu) {
                                    case "account":
                                        return (
                                            <div className="flex flex-col items-start w-full flex-1 gap-8">
                                                <div className="w-full sm:w-fit">
                                                    <h1 className="font-bold text-xl ">{ session?.data?.user?.name} <i className="text-sm text-slate-500 not-italic font-light">({ session?.data?.user?.name })</i></h1>
                                                    <p className="text-slate-700">{ session?.data?.user?.email }</p>

                                                    <div className="flex flex-row sm:items-center sm:gap-8 justify-between w-full flex-1 sm:flex-grow-0">
                                                        <a href="" className="text-violet-400">Forgot Password?</a>
                                                        <a href="" className="text-violet-400">Change Username</a>
                                                        <a href="" className="text-violet-400" onClick={async () => {
                                                            const data = await signOut({ redirect: false, callbackUrl: window.location.origin });
                                                            router.push(data.url);
                                                        }}>Log Out</a>
                                                    </div>
                                                </div>
                                                
                                                {
                                                    eligibleForDownload == 1 ? 
                                                    <div className="flex flex-row gap-4 px-2 pl-3 py-2 bg-violet-200 w-full rounded-xl items-center">
                                                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-violet-500"><Check size={20} color="#fff" /></div>

                                                        <div className="flex flex-col flex-1">
                                                            <h1 className="font-semibold text-violet-900">You are eligible for Reseda { small ? "" : "Pre-Release" }</h1>
                                                            {/* <p className="text-violet-700">You have been selected to join us in pre-release.</p>  */}
                                                        </div>

                                                        
                                                        <Button className="text-violet-50 bg-violet-500" icon={<ArrowUpRight size={16}/>}>{ small ? "" : "Download" }</Button>
                                                    </div>
                                                    :
                                                    eligibleForDownload == 2 ?
                                                    <div className="flex flex-row gap-4 px-4 py-2 bg-orange-200 w-full rounded-xl items-center">
                                                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-orange-400"><Check size={20} color="#fff" /></div>

                                                        <div className="flex flex-col flex-1">
                                                            <h1 className="font-semibold text-orange-900">Verification Pending</h1>
                                                            <p className="text-orange-900">Your account is awaiting approval, average approval time is 24h.</p> 
                                                        </div>

                                                        {/* <Button className="" icon={<ArrowUpRight size={16}/>}>Download</Button> */}
                                                    </div>
                                                    :
                                                    <></>
                                                }
                                                
                                                <div className="flex flex-col gap-2 rounded-lg px-0 py-2 w-full">
                                                    <p className="font-bold text-xl">Plan</p>

                                                    <div className="flex flex-row gap-16">
                                                    {
                                                        (() => {
                                                            switch(userInformation?.tier) {
                                                                case "FREE":
                                                                    return (
                                                                        <>
                                                                            <h2 className="text-xl relative after:content-['FREE'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-300">Reseda</h2>
                                                                            
                                                                            <div className="flex sm:flex-row flex-col flex-1 justify-around">	
                                                                                <div className="flex flex-row gap-2 items-center">
                                                                                    <div className="h-4 w-4 rounded-full bg-orange-300 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">5GB/mo Free</div>
                                                                                </div>
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-orange-300 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700"><strong className="text-orange-300 rounded-sm py-0 px-1" >50MB/s</strong> Transfer</div>
                                                                                </div>
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-orange-300 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">1 Device Max</div>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                case "BASIC":
                                                                    return (
                                                                        <>
                                                                            <h2 className="text-xl relative after:content-['BASIC'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-400">Reseda</h2>

                                                                            <div className="flex sm:flex-row flex-col flex-1 justify-around">	
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-orange-400 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">First 5GB/mo Free</div>
                                                                                </div>
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-orange-400 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">Unlimited Data Cap</div>
                                                                                </div>
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-orange-400 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700"><strong className="text-orange-400 rounded-sm py-0 px-1" >500MB/s</strong> Max Transfer</div>
                                                                                </div>
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-orange-400 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">5 Device Max <i className="not-italic text-sm text-slate-400">(at the same time)</i> </div>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                case "PRO":
                                                                    return (
                                                                        <>
                                                                            <h2 className="text-xl relative after:content-['PRO'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-500">Reseda</h2>

                                                                            <div className="flex sm:flex-row flex-col flex-1 justify-around">	
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">First 5GB/mo Free</div>
                                                                                </div>
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">Unlimited Data Cap</div>
                                                                                </div>
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">Up to <strong className="text-orange-500 rounded-sm py-0 px-1" >1GB/s</strong> Transfer</div>
                                                                                </div>
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">Unlimited Devices <i className="not-italic text-sm text-slate-400">(concurrent)</i> </div>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                case "SUPPORTER":
                                                                    return (
                                                                        <>
                                                                            <h2 className="text-xl relative after:content-['SUPPORTER'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-300 after:bg-gradient-to-tr after:text-transparent after:bg-clip-text">Reseda</h2>

                                                                            <div className="flex sm:flex-row flex-col flex-1 justify-around">	
                                                                                <div className="flex flex-row gap-2 items-center">
                                                                                    <div className="h-4 w-4 rounded-full bg-gradient-to-tr flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">50GB Free</div>
                                                                                </div>
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-gradient-to-tr flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">Up to <strong className="bg-gradient-to-tr text-transparent bg-clip-text rounded-sm py-0 px-1" >1GB/s</strong> Transfer</div>
                                                                                </div>
                                                                                <div className="flex flex-row gap-2 items-center ">
                                                                                    <div className="h-4 w-4 rounded-full bg-gradient-to-tr flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                                                    <div className="text-base text-slate-700">Unlimited Devices <i className="not-italic text-sm text-slate-400">(concurrent)</i> </div>
                                                                                </div>
                                                                            </div>
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
                                            </div>
                                        )
                                    case "usage":
                                        return (
                                            <div className="flex flex-col items-start h-full flex-1">
                                                <div className="flex sm:flex-row flex-col sm:items-center justify-between w-full">
                                                    <div className="flex sm:flex-col flex-row items-center justify-between sm:py-0 py-5">
                                                        <h1 className="font-bold text-xl ">Usage <i className="text-sm text-slate-500 not-italic font-light">(This Billing Period)</i></h1>
                                                        <p className="text-slate-700">{ new Date().toLocaleString("en-nz", { month: "long" }) }</p>
                                                    </div>

                                                    <div className="flex flex-row items-center gap-6">
                                                        <div className="flex flex-row gap-2 items-center bg-violet-100 rounded-md">
                                                            <div className="bg-violet-300 px-2 py-1 rounded-md flex flex-row items-center gap-4 text-white">
                                                                Up
                                                                <ArrowUp size={16} color={"#fff"}/>
                                                            </div>
                                                            
                                                            <p className="px-4">
                                                                { usageInformation ? getSize(usageInformation?.reduce((a, b) => a + (parseInt(b.up) || 0), 0)) : "..." }
                                                            </p>
                                                            
                                                        </div>

                                                        <div className="flex flex-row gap-2 items-center bg-violet-100 rounded-md">
                                                            <div className="bg-violet-500 px-2 py-1 rounded-md flex flex-row items-center gap-4 text-white">
                                                                Down
                                                                <ArrowDown size={16} color={"#fff"}/>
                                                            </div>

                                                            <p className="px-4">
                                                                { usageInformation ? getSize(usageInformation?.reduce((a, b) => a + (parseInt(b.down) || 0), 0)) : "..." }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-1 w-full p-8">
                                                    {
                                                        usageInformation ? 
                                                        <Chart
                                                            data={data}
                                                            month={new Date().getMonth()}
                                                        />
                                                        :
                                                        <div className="flex items-center justify-center flex-1">
                                                            <Loader color={"#000"} height={20} />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    case "billing":
                                        return (
                                            <div className="flex flex-col items-start">
                                                <h1 className="font-semibold text-lg">Billing</h1>
                                            </div>
                                        )
                                    default:
                                        return (
                                            <div className="flex flex-col items-center justify-center">
                                                Something went wrong!
                                            </div>
                                        )
                                }
                            })()
                        }
                    </div>
                </div>
            </div>
		</div>
	)
}

export function getSize(size) {
    var sizes = [' Bytes', ' KB', ' MB', ' GB', 
                 ' TB', ' PB', ' EB', ' ZB', ' YB'];
    
    for (var i = 1; i < sizes.length; i++) {
        if (size < Math.pow(1024, i)) 
          return (Math.round((size / Math.pow(
            1024, i - 1)) * 100) / 100) + sizes[i - 1];
    }
    return size;
}