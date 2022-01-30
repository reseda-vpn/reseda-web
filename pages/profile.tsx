import { useEffect, useRef, useState } from 'react';
import { Gradient } from '@components/gradient'
import { supabase } from '@root/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import Header from '@components/header';
import { Activity, CreditCard, Settings, User as UserIcon } from 'react-feather';

export const getServerSideProps = async ({ req, res }) => {
    const { user } = await supabase.auth.api.getUserByCookie(req);
  
    if (!user) return { props: {}, redirect: { destination: '/login', permanent: false } }

    // const { data, error } = await supabase.from('users').select("*").match({ id: "b78e7286-c7ad-4b7d-b427-28f541894fbd" }).then(e => {
    //     console.log(e);
    //     return e;
    // });

    return {
        props: {
            user,
            // profile: {
            //     data, error
            // }
        }
    };
}

export default function Home({ user, profile }) {
    const [ userInformation, setUserInformation ] = useState(null);
    const [ menu, setMenu ] = useState("account");
    const router = useRouter();

	useEffect(() => {
        // Create your instance
        const gradient = new Gradient()

        // Call `initGradient` with the selector to your canvas

        //@ts-expect-error
        gradient.initGradient('#gradient-canvas');

        const a = async () => {
            const { data, error } = await supabase.from('users').select("*").match({ id: user.id });
            if(!error) setUserInformation(data[0]);

            console.log(data);
        };

        a();
	}, [router, user.id]);

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

                    <div>
                        {
                            (() => {
                                switch(menu) {
                                    case "account":
                                        return (
                                            <div className="flex flex-col items-start">
                                                <h1 className="font-bold text-xl ">{userInformation?.username}</h1>
                                                <p className="text-slate-700">{ user?.email }</p>
                                                
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
