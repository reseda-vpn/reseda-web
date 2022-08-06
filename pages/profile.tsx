import { useEffect, useMemo, useRef, useState } from 'react';
import { Gradient } from '@components/gradient'
import { useRouter } from 'next/router';
import styles from '@styles/Home.module.css'
import Header from '@components/header';
import { Activity, ArrowDown, ArrowUp, ArrowUpRight, Check, CreditCard, Delete, Download, Edit, LogOut, Settings, Trash, User as UserIcon } from 'react-feather';

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
    const [ eligibleForDownload, setEligibleForDownload ] = useState<0 | 1 | 2>(0); // 0 is not returned, 1 is true, 2 is false.
    const [ usageInformation, setUsageInformation ] = useState<Usage[]>(null);
    const [ menu, setMenu ] = useState("account");
    const router = useRouter();
    const [ month, setMonth ] = useState(new Date().getMonth());

    const [ thisMonthData, setThisMonthData ] = useState([]);
    const [ changingUsername, setChangingUsername ] = useState(false);
    const [ deletingAccount, setDeletingAccount ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const new_data = usageInformation?.filter(e => new Date(e.connStart).getMonth() == month);

        setThisMonthData(new_data);
    }, [usageInformation, month])

	useEffect(() => {
        localStorage.setItem("reseda.jwt", JSON.stringify(ss_session?.jwt));

        setUserInformation(user.accounts[0]);
        setEligibleForDownload(eligible.claimable ? 1 : 2);
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

        if(session.status !== "authenticated") router.push('./login');

        const as = async () => {
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
                <Header />
                <canvas id="gradient-canvas" className={`top-0 sm:h-64 h-12 ${small ? "opacity-0" : ""}`} data-transition-in></canvas> {/*  style={{ height: small ? '50px !important' : '250px !important' }} */}
        
                {
                    changingUsername ?
                    <div 
                        className="fixed top-0 left-0 flex flex-1 h-screen w-screen z-50 bg-slate-400 bg-opacity-40 items-center content-center justify-center"
                        onClick={() => { 
                            setChangingUsername(false);
                        }}
                        >
                        <div 
                            className={"p-6 bg-white text-slate-800 border-1 border-slate-400 rounded-lg " + styles.border}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col justify-between pb-2 gap-y-4">
                                <div>
                                    <h2 className="font-bold text-xl">Change Username</h2>
                                    <p className="text-sm text-slate-500 not-italic font-light">Current Username: <strong className="font-bold">{user?.name}</strong></p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="uppercase text-xs text-slate-500 not-italic">New Username</p>
                                    <InputField 
                                        noArrow={false}
                                        enterCallback={(username) => {
                                        fetch('/api/user/username', {
                                            body: JSON.stringify({ 
                                                username: username,
                                                userId: userInformation.userId
                                            }),
                                            method: 'POST'
                                        })
                                            .then(e => {
                                                if(e.ok) {
                                                    const event = new Event("visibilitychange");
                                                    document.dispatchEvent(event);
                                                    // window.location.reload();
                                                    user.name = username;
                                                    setChangingUsername(false);
                                                }
                                            })
                                    }} callback={() => {}} placeholder={user?.name}></InputField>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
                }

                {
                    deletingAccount ?
                    <div 
                        className="fixed top-0 left-0 flex flex-1 h-screen w-screen z-50 bg-slate-400 bg-opacity-40 items-center content-center justify-center"
                        onClick={() => { 
                            if(!loading) setDeletingAccount(false);
                        }}
                        >
                        <div 
                            className={"p-6 bg-white text-slate-800 border-1 border-slate-400 rounded-lg " + styles.border}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col justify-between pb-2 gap-y-4">
                                <div>
                                    <div className="flex flex-row items-center justify-between">
                                        <h2 className="font-bold text-xl">Delete Account</h2>
                                        <FaExclamationTriangle color={"#EF4444"} size={24} />
                                    </div>
                                    
                                    <p className="text-sm text-red-500 not-italic font-light">Warning: This action is <strong className="font-bold text-red-500">irreversible</strong>.</p>
                                    <p className="text-sm text-slate-500 not-italic font-light"> Are you sure you want to delete your account?</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="uppercase text-xs text-slate-500 not-italic">Enter Password to Confirm Deletion</p>
                                    <InputField 
                                        noArrow={loading}
                                        enterCallback={(psw) => {
                                            setLoading(true);
                                            fetch('/api/auth/delete', {
                                                body: JSON.stringify({ 
                                                    email: session.data.user.email,
                                                    password: psw
                                                }),
                                                method: 'POST'
                                            })
                                                .then(async e => {
                                                    if(e.ok) {
                                                        session
                                                        setLoading(false);
                                                        const event = new Event("visibilitychange");
                                                        document.dispatchEvent(event);
                                                        // window.location.reload();
                                                        setDeletingAccount(false);

                                                        await signOut();

                                                        router.push("/");
                                                    }
                                                })
                                    }} callback={() => {}} placeholder="Password" type={"password"} customValue={<div className="flex flex-row items-center justify-between w-full"><p>Deleting Account...</p><Loader color="#000" height={20}></Loader></div>}></InputField>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
                }   

                <div className="flex flex-col sm:flex-row px-4 max-w-screen-lg w-full my-0 mx-auto z-40 h-full flex-1 gap-8 py-4 sm:mt-64" > {/* style={{ marginTop: '250px', marginBottom: '50px' }} */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:w-32 w-full">
                        <div className="flex flex-row justify-between gap-5 sm:justify-start sm:flex-col sm:gap-2 w-full">
                            {/* <p className="font-normal text-sm text-slate-600 sm:flex hover:text-slate-800">Account</p> */}
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "account" ? "bg-violet-500 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("account")} >{ <UserIcon size={16}/>  } Account</p>
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "usage" ? "bg-violet-500 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("usage")}>{ <Activity size={16}/>  } Usage</p>
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 ${menu == "billing" ? "bg-violet-500 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("billing")}>{ <CreditCard size={16}/>  } Billing</p>
                        </div>

                        {/* <div className="flex flex-col gap-2 w-full">
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 h-8 content-center ${menu == "settings" ? "bg-violet-500 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("settings")}>{ <Settings size={16}/>  } {small ? "" : "Settings"}</p>
                        </div> */}
                    </div>

                    <div className="flex flex-col flex-1 w-full">
                        {
                            (() => {
                                switch(menu) {
                                    case "account":
                                        return (
                                            <div className="flex flex-col items-start w-full gap-8">
                                                <div className="w-full sm:w-fit flex flex-col flex-1">
                                                    <h1 className="font-bold text-xl ">{ user?.name }</h1> {/*  <i className="text-sm text-slate-500 not-italic font-light">({ user?.name })</i> */}
                                                    <p className="text-slate-700">{ session?.data?.user?.email }</p>

                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 justify-between w-full flex-1 sm:flex-grow-0">
                                                        {
                                                            user.accounts[0].type == "credentials" ?
                                                            <p className="text-violet-200 line-through hover:cursor-pointer">Change Password</p>
                                                            :
                                                            <></>
                                                        }
                                                        <p className="text-violet-400 hover:cursor-pointer" onClick={(e) => {
                                                            e.preventDefault();
                                                            setChangingUsername(true)
                                                        }}>Change Username</p>
                                                        <p className="text-violet-400 hover:cursor-pointer" onClick={async () => {
                                                            const data = await signOut({ redirect: false, callbackUrl: window.location.origin });
                                                            router.push(data.url);
                                                        }}>Log Out</p>
                                                        <p onClick={(e) => {
                                                            e.preventDefault();
                                                            setDeletingAccount(true)
                                                        }} className="text-red-400 flex-1 flex- justify-self-end hover:cursor-pointer">
                                                            Delete Account
                                                        </p>
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
                                                        
                                                        <Button className="text-violet-50 bg-violet-500" href="/download" icon={<ArrowUpRight size={16}/>}>{ small ? "" : "Download" }</Button>
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
                                                        <h1 className="font-bold text-xl ">{ new Date().toLocaleString("en-nz", { month: "long" }) } <i className="text-sm text-slate-500 not-italic font-light">(This Billing Period)</i></h1>
                                                        {/* <p className="text-slate-700"></p> */}
                                                    </div>

                                                    <div className="flex flex-row items-center gap-6">
                                                        <div className="flex flex-row gap-2 items-center bg-violet-100 rounded-md">
                                                            <div className="bg-violet-300 px-2 py-1 rounded-md flex flex-row items-center gap-4 text-white">
                                                                Up
                                                                <ArrowUp size={16} color={"#fff"}/>
                                                            </div>
                                                            
                                                            <p className="px-4">
                                                                { thisMonthData ? getSize(thisMonthData?.reduce((a, b) => a + (parseInt(b.up) || 0), 0)) : "..." }
                                                            </p>
                                                            
                                                        </div>

                                                        <div className="flex flex-row gap-2 items-center bg-violet-100 rounded-md">
                                                            <div className="bg-violet-500 px-2 py-1 rounded-md flex flex-row items-center gap-4 text-white">
                                                                Down
                                                                <ArrowDown size={16} color={"#fff"}/>
                                                            </div>

                                                            <p className="px-4">
                                                                { thisMonthData ? getSize(thisMonthData?.reduce((a, b) => a + (parseInt(b.down) || 0), 0)) : "..." }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-1 w-full py-8">
                                                    {
                                                        usageInformation ? 
                                                        <LinearChart data={usageInformation} month={new Date().getMonth()} />
                                                        // <Chart
                                                        //     data={data}
                                                        //     month={new Date().getMonth()}
                                                        // />
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
                                                <h1 className="font-bold text-xl">Billing</h1>
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