import { useEffect, useRef, useState } from 'react';
import { Gradient } from '@components/gradient'
import { supabase } from '@root/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import Header from '@components/header';
import { Activity, CreditCard, Settings, User as UserIcon } from 'react-feather';

export default function Home() {
    const [ user, setUser ] = useState<User>(null);
    const [ menu, setMenu ] = useState("account");
    const router = useRouter();

	useEffect(() => {
        // Create your instance
        const gradient = new Gradient()

        // Call `initGradient` with the selector to your canvas

        //@ts-expect-error
        gradient.initGradient('#gradient-canvas');

        const auth_usr = supabase.auth.user();
        
        if(auth_usr.aud == "authenticated") setUser(auth_usr);
        else router.push('./login');
	}, [router]);

	return (
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<div className="flex-col flex font-sans min-h-screen w-screen relative overflow-hidden">
				<Header />

                <canvas id="gradient-canvas" className="md:top-0" style={{ height: '250px' }} data-transition-in></canvas>

                <div className="flex flex-row py-2 px-4 max-w-screen-lg w-full my-0 mx-auto z-50 h-full flex-1 gap-8" style={{ marginTop: '250px', marginBottom: '50px' }}>
                    <div className="flex flex-col justify-between">
                        <div>
                            {/* <p className="font-normal text-sm text-slate-600 sm:flex hover:text-slate-800">Account</p> */}
                            <p className="flex flex-row items-center gap-2 px-2 py-1" onClick={() => setMenu("account")} >{ <UserIcon size={16}/>  } Account</p>
                            <p className="flex flex-row items-center gap-2 px-2 py-1" onClick={() => setMenu("usage")}>{ <Activity size={16}/>  } Usage</p>
                            <p className="flex flex-row items-center gap-2 px-2 py-1" onClick={() => setMenu("billing")}>{ <CreditCard size={16}/>  } Billing</p>
                        </div>

                        <p className="flex flex-row items-center gap-2 px-2 py-1 self-end" >{ <Settings size={16}/>  } Settings</p>
                    </div>

                    <div>
                        {
                            (() => {
                                switch(menu) {
                                    case "account":
                                        return (
                                            <div className="flex flex-col items-start">
                                                <h1 className="font-semibold text-lg"></h1>
                                                <p>{ user?.email }</p>
                                                
                                            </div>
                                        )
                                    case "usage":
                                        return (
                                            <div>

                                            </div>
                                        )
                                    case "billing":
                                        return (
                                            <div>

                                            </div>
                                        )
                                    default:
                                        return (
                                            <div>
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
