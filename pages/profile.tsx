import { useEffect, useRef, useState } from 'react';
import { Gradient } from '@components/gradient'
import { supabase } from '@root/client';
import { useRouter } from 'next/router';
import Header from '@components/header';
import { Activity, ArrowUpRight, Check, CreditCard, Download, Settings, User as UserIcon } from 'react-feather';

import { useSession, getSession, signIn, signOut, getCsrfToken } from "next-auth/react"
import { prisma } from '@prisma/client';
import Button from '@components/un-ui/button';
import useMediaQuery from '@components/media_query';

export const getServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });
    const csrfToken = await getCsrfToken({ req: req });

    if (!session) return { props: {}, redirect: { destination: '/login', permanent: false } }
    console.log(session, csrfToken);

    return {
        props: {
            session,
            csrfToken
        },
    }
}

export default function Home({ ss_session, token }) {
    const session = useSession(ss_session);
	const small = useMediaQuery(640);

    const [ userInformation, setUserInformation ] = useState(null);
    const [ eligibleForDownload, setEligibleForDownload ] = useState<0 | 1 | 2>(0); // 0 is not returned, 1 is true, 2 is false.
    const [ menu, setMenu ] = useState("account");
    const router = useRouter();

	useEffect(() => {
        // Create your instance
        const gradient = new Gradient()

        if(session.status !== "authenticated") router.push('./login');

        //@ts-expect-error
        gradient.initGradient('#gradient-canvas');


        const as = async () => {
            const usr = await fetch(`/api/user/${session?.data?.user?.email}`)
            const data = await usr.json();

            setUserInformation(data.accounts[0]);

            const eligible = await fetch(`/api/lead/email/${session?.data?.user?.email}`);
            const eligibility = await eligible.json();

            setEligibleForDownload(eligibility.type == "eligible" ? 1 : 2);
        }

        if(session.status == "authenticated") as();    
	}, [session, router]);

	return (
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<div className="flex-col flex font-sans min-h-screen w-screen relative overflow-hidden">
				<Header />

                <canvas id="gradient-canvas" className="md:top-0 sm:h-64 h-12" data-transition-in></canvas> {/*  style={{ height: small ? '50px !important' : '250px !important' }} */}

                <div className="flex flex-col sm:flex-row px-4 max-w-screen-lg w-full my-0 mx-auto z-50 h-full flex-1 gap-8 py-4 sm:mt-64" > {/* style={{ marginTop: '250px', marginBottom: '50px' }} */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:w-32 w-full">
                        <div className="flex flex-row sm:flex-col gap-2">
                            {/* <p className="font-normal text-sm text-slate-600 sm:flex hover:text-slate-800">Account</p> */}
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "account" ? "bg-violet-700 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("account")} >{ <UserIcon size={16}/>  } Account</p>
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "usage" ? "bg-violet-700 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("usage")}>{ <Activity size={16}/>  } Usage</p>
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "billing" ? "bg-violet-700 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("billing")}>{ <CreditCard size={16}/>  } Billing</p>
                        </div>

                        <div className="flex flex-col gap-2"> {/* height: 32px; align-items: center; justify-content: center; */}
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 h-8 content-center ${menu == "settings" ? "bg-violet-700 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("settings")}>{ <Settings size={16}/>  } {small ? "" : "Settings"}</p>
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
                                                                            
                                                                            <div className="flex flex-row flex-1 justify-around">	
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

                                                                            <div className="flex flex-row flex-1 justify-around">	
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

                                                                            <div className="flex flex-row flex-1 justify-around">	
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

                                                                            <div className="flex flex-row flex-1 justify-around">	
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
                                            <div className="flex flex-col items-start">
                                                <h1 className="font-semibold text-lg">Usage</h1>
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
