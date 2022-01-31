import { useEffect, useRef, useState } from 'react';
import { Gradient } from '@components/gradient'
import { supabase } from '@root/client';
import { useRouter } from 'next/router';
import Header from '@components/header';
import { Activity, Check, CreditCard, Settings, User as UserIcon } from 'react-feather';

import { useSession, signIn, signOut } from "next-auth/react"

export const getServerSideProps = async ({ req, res }) => {
    // const { user } = await supabase.auth.api.getUserByCookie(req);
    // if (!user) return { props: {}, redirect: { destination: '/login', permanent: false } }

    // const { data, error } = await supabase.from('users').select("*").match({ id: "b78e7286-c7ad-4b7d-b427-28f541894fbd" }).then(e => {
    //     console.log(e);
    //     return e;
    // });

    // const output = await fetch(`${process.env.URL}/api/user/1`, {
    //     method: "GET"
    // });
    // const json = await output.json();

    return {
        props: {
            user: {},
            prisma: {},
        }
    };
}

export default function Home({ user, prisma }) {
    const session = useSession();
    const [ userInformation, setUserInformation ] = useState(null);
    const [ menu, setMenu ] = useState("account");
    const router = useRouter();

    console.log(session);

	useEffect(() => {
        // if(!user) {
        //     router.push('./login');
        // }

        // Create your instance
        const gradient = new Gradient()

        // Call `initGradient` with the selector to your canvas

        //@ts-expect-error
        gradient.initGradient('#gradient-canvas');

        // const a = async () => {
        //     const { data, error } = await supabase.from('users').select("*").match({ id: user.id });
        //     if(!error) setUserInformation(data[0]);

        //     console.log(data);
        // };

        // supabase.auth.onAuthStateChange((state) => {
        //     if(state == "SIGNED_OUT") {
        //         router.push('./login');
        //     }
        // });

        // if(user) a();    
	}, [router, user]);

	return (
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<div className="flex-col flex font-sans min-h-screen w-screen relative overflow-hidden">
				<Header />

                <canvas id="gradient-canvas" className="md:top-0" style={{ height: '250px' }} data-transition-in></canvas>

                <div className="flex flex-row py-2 px-4 max-w-screen-lg w-full my-0 mx-auto z-50 h-full flex-1 gap-8" style={{ marginTop: '250px', marginBottom: '50px' }}>
                    <div className="flex flex-col justify-between w-32">
                        <div className="flex flex-col gap-2">
                            {/* <p className="font-normal text-sm text-slate-600 sm:flex hover:text-slate-800">Account</p> */}
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "account" ? "bg-violet-700 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("account")} >{ <UserIcon size={16}/>  } Account</p>
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "usage" ? "bg-violet-700 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("usage")}>{ <Activity size={16}/>  } Usage</p>
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "billing" ? "bg-violet-700 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("billing")}>{ <CreditCard size={16}/>  } Billing</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "settings" ? "bg-violet-700 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("settings")}>{ <Settings size={16}/>  } Settings</p>
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 w-full">
                        {
                            (() => {
                                switch(menu) {
                                    case "account":
                                        return (
                                            <div className="flex flex-col items-start w-full flex-1 gap-8">
                                                <div>
                                                    <h1 className="font-bold text-xl ">{userInformation?.username}</h1>
                                                    <p className="text-slate-700">{ user?.email }</p>

                                                    <div className="flex flex-row items-center gap-8">
                                                        <a href="" className="text-violet-400">Forgot Password?</a>
                                                        <a href="" className="text-violet-400">Change Username</a>
                                                        <a href="" className="text-violet-400" onClick={() => {
                                                            supabase.auth.signOut();
                                                        }}>Log Out</a>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col gap-2 bg-slate-100 rounded-lg px-4 py-2 w-full">
                                                    <p className="text-sm uppercase text-slate-400">Plan</p>
                                                    {
                                                        (() => {
                                                            switch(userInformation?.tier) {
                                                                case "FREE":
                                                                    return (
                                                                        <>
                                                                            <h2 className="text-xl relative after:content-['FREE'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-300">Reseda</h2>
                                                                            
                                                                            <div className="flex flex-col flex-1">	
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

                                                                            <div className="flex flex-col flex-1">	
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

                                                                            <div className="flex flex-col flex-1">	
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

                                                                            <div className="flex flex-col flex-1">	
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
