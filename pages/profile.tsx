import { useEffect, useMemo, useRef, useState } from 'react';
import { Gradient } from '@components/gradient'
import { useRouter } from 'next/router';
import styles from '@styles/Home.module.css'
import Header from '@components/header';
import { Activity, ArrowDown, ArrowUp, ArrowUpRight, Check, CreditCard, Delete, Download, Edit, Eye, LogOut, Settings, Trash, User as UserIcon, X } from 'react-feather';

import { useSession, getSession, signIn, signOut, getCsrfToken } from "next-auth/react"
import { Account, Usage, User } from '@prisma/client';
import Button from '@components/un-ui/button';
import useMediaQuery from '@components/media_query';
import Loader from '@components/un-ui/loader';
import prisma from "@root/lib/prisma"
import LinearChart from '@components/linear_chart';
import InputField from '@components/un-ui/input_field';
import { FaExclamationTriangle } from 'react-icons/fa';
import Billing, { getSize, getUsage } from '@components/billing';
import CurrentPlan from '@components/current_plan';
import { SelectionParent } from '@components/selection_parent';

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

export default function Home({ ss_session, user, eligible }) {
    const session = useSession(ss_session);
	const small = useMediaQuery(640);

    const [ userInformation, setUserInformation ] = useState<Account>(null);
    const [ eligibleForDownload, setEligibleForDownload ] = useState<0 | 1 | 2>(0); // 0 is not returned, 1 is true, 2 is false.
    const [ usageInformation, setUsageInformation ] = useState<Usage[]>(null);
    const [ menu, setMenu ] = useState("account");
    const router = useRouter();
    const [ month, setMonth ] = useState(new Date().getMonth());

    const [ thisMonthData, setThisMonthData ] = useState<{
        up: number,
        down: number
    }>();
    const [ changingUsername, setChangingUsername ] = useState(false);
    const [ deletingAccount, setDeletingAccount ] = useState(false);
    
    const [ changingPassword, setChangingPassword ] = useState<{
        state: 0 | 1 | 2 | 3,
        password: string,
        pass_correct: boolean,
        fetch_message: string | null,
    }>({
        state: 0,
        pass_correct: false,
        password: "",
        fetch_message: null
    });

    const [ changingLimit, setChangingLimit ] = useState<{
        state: boolean,
        fetch_message: string | null,
    }>({
        state: false,
        fetch_message: null
    });

    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const new_data: Usage[] = usageInformation?.filter(e => new Date(e.connStart).getMonth() == month);

        let down = 0;
        let up = 0;

        new_data?.forEach(e => {
            down+= parseInt(e.down);
            up+= parseInt(e.up);
        });

        setThisMonthData({
            up, down
        });
    }, [usageInformation, month])

	useEffect(() => {
        localStorage.setItem("reseda.jwt", JSON.stringify(ss_session?.jwt));
        
        if(!userInformation) setUserInformation(user.accounts[0]);
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
        <div className="flex-col flex font-sans min-h-screen dark:bg-[#05010d]" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
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

                {
                    changingPassword.state !== 0 ?
                    <div 
                        className="fixed top-0 left-0 flex flex-1 h-screen w-screen z-50 bg-slate-400 bg-opacity-40 items-center content-center justify-center"
                        onClick={() => { 
                            if(!loading) setChangingPassword({
                                ...changingPassword,
                                state: 0,
                                fetch_message: null
                            });
                        }}
                        >
                        <div 
                            className={"p-6 bg-white text-slate-800 border-1 border-slate-400 rounded-lg " + styles.border}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col justify-between pb-2 gap-y-4">
                                {
                                    changingPassword.state == 2 ? 
                                    <>
                                        <div>
                                            <div className="flex flex-row items-center justify-between">
                                                <h2 className="font-bold text-xl">Choose New Password</h2>
                                            </div>

                                            <p className="text-sm text-slate-500 not-italic font-light">Please enter your new password.</p>
                                        </div>

                                        {
                                            !changingPassword.fetch_message ?   
                                                <></>
                                            :
                                                <div className="flex flex-row items-center justify-between w-full">
                                                    <X color="#EF4444" height={20}></X>
                                                    <p className="text-red-400">{changingPassword.fetch_message}</p>
                                                </div>
                                        }

                                        <div className="flex flex-col gap-2">
                                            <p className="uppercase text-xs text-slate-500 not-italic">Enter New Password</p>
                                            <InputField 
                                                noArrow={loading}
                                                enterCallback={(psw) => {
                                                    setLoading(true);
                                                    fetch('/api/auth/change_pass', {
                                                        body: JSON.stringify({ 
                                                            email: session.data.user.email,
                                                            new_password: psw,
                                                            old_password: changingPassword.password
                                                        }),
                                                        method: 'POST'
                                                    })
                                                        .then(async e => {
                                                            if(e.ok) {
                                                                setLoading(false);
                                                                setChangingPassword({
                                                                    ...changingPassword,
                                                                    state: 3,
                                                                    password: psw,
                                                                    pass_correct: true,
                                                                    fetch_message: null
                                                                });
                                                            }else {
                                                                const k = await e.json();
                                                                setLoading(false);
                                                                setChangingPassword({
                                                                    ...changingPassword,
                                                                    fetch_message: k.message
                                                                })
                                                            }
                                                        })
                                            }} callback={() => {}} placeholder="Password" type={"password"} customValue={
                                                <div className="flex flex-row items-center justify-between w-full">
                                                    <p>Verifying Password...</p>
                                                    <Loader color="#000" height={20}></Loader>
                                                </div>
                                            }></InputField>
                                        </div>
                                    </>
                                    :
                                    changingPassword.state == 3 ?
                                    <>
                                        <div>
                                            <div className="flex flex-row items-center justify-between">
                                                <h2 className="font-bold text-xl">Password Changed</h2>
                                            </div>

                                            <p className="text-sm text-slate-500 not-italic font-light">Well Done!</p>

                                            
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <p className="uppercase text-xs text-slate-500 not-italic">NEW PASSWORD</p>
                                            <InputField 
                                                noArrow={true}
                                                enterCallback={(psw) => {
                                                    setLoading(true);
                                                    fetch('/api/rauth/login', {
                                                        body: JSON.stringify({ 
                                                            email: session.data.user.email,
                                                            password: psw
                                                        }),
                                                        method: 'POST'
                                                    })
                                                        .then(async e => {
                                                            if(e.ok) {
                                                                setLoading(false);
                                                                setChangingPassword({
                                                                    ...changingPassword,
                                                                    state: 2,
                                                                    password: psw,
                                                                    pass_correct: true
                                                                });
                                                            }
                                                        })
                                            }} callback={() => {}} placeholder="Password" value={changingPassword.password} readOnly={true} type={"password"}></InputField>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div>
                                            <div className="flex flex-row items-center justify-between">
                                                <h2 className="font-bold text-xl">Change Password</h2>
                                            </div>

                                            <p className="text-sm text-slate-500 not-italic font-light"> Changing password, enter your old password to continue</p>
                                        </div>

                                        {
                                            !changingPassword.fetch_message ?   
                                                <></>
                                            :
                                                <div className="flex flex-row items-center justify-between w-full">
                                                    <X color="#EF4444" height={20}></X>
                                                    <p className="text-red-400">{changingPassword.fetch_message}</p>
                                                </div>
                                        }

                                        <div className="flex flex-col gap-2">
                                            <p className="uppercase text-xs text-slate-500 not-italic">Enter Old Password</p>
                                            <InputField 
                                                noArrow={loading}
                                                enterCallback={(psw) => {
                                                    setLoading(true);
                                                    fetch('/api/rauth/login', {
                                                        body: JSON.stringify({ 
                                                            email: session.data.user.email,
                                                            password: psw
                                                        }),
                                                        method: 'POST'
                                                    })
                                                        .then(async e => {
                                                            if(e.ok) {
                                                                setLoading(false);
                                                                setChangingPassword({
                                                                    ...changingPassword,
                                                                    state: 2,
                                                                    password: psw,
                                                                    pass_correct: true,
                                                                    fetch_message: null
                                                                });
                                                            }else {
                                                                const k = await e.json();
                                                                setLoading(false);
                                                                setChangingPassword({
                                                                    ...changingPassword,
                                                                    fetch_message: k.message
                                                                })
                                                            }
                                                        })
                                            }} callback={() => {}} placeholder="Password" type={"password"} customValue={
                                                <div className="flex flex-row items-center justify-between w-full">
                                                    <p>Verifying Password...</p>
                                                    <Loader color="#000" height={20}></Loader>
                                                </div>
                                            }></InputField>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <></>
                }  

                {
                    changingLimit.state ?
                    <div 
                        className="fixed top-0 left-0 flex flex-1 h-screen w-screen z-50 bg-slate-400 bg-opacity-40 items-center content-center justify-center"
                        onClick={() => { 
                            setChangingLimit({
                                ...changingLimit,
                                state: false
                            });
                        }}
                        >
                        <div 
                            className={"p-6 bg-white text-slate-800 border-1 border-slate-400 rounded-lg " + styles.border}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col justify-between pb-2 gap-y-4">
                                <div>
                                    <h2 className="font-bold text-xl">Change Limit</h2>
                                    <p className="text-sm text-slate-500 not-italic font-light">Current Limit: <strong className="font-bold">{getSize(userInformation?.limit)} (${ (getUsage({ up: 0, down: parseInt(userInformation?.limit)}, userInformation?.tier).cost).toFixed(2) })</strong></p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <SelectionParent plan={userInformation?.tier} state={["", () => {}]} callback={(quantity) => {
                                        fetch(`/api/user/limit/${userInformation.userId}/${quantity}`, {
                                            method: "POST"
                                        }).then(async e => {
                                            const k = await e.json();
                                            setUserInformation(k);

                                            setChangingLimit({
                                                ...changingLimit,
                                                state: false
                                            });
                                        })
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
                } 

                <div className="flex flex-col sm:flex-row px-4 max-w-screen-lg w-full my-0 mx-auto z-40 h-full flex-1 gap-8 py-4 sm:mt-64 " > {/* style={{ marginTop: '250px', marginBottom: '50px' }} */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:w-32 w-full">
                        <div className="flex flex-row justify-between gap-5 sm:justify-start sm:flex-col sm:gap-2 w-full">
                            {/* <p className="font-normal text-sm text-slate-600 sm:flex hover:text-slate-800">Account</p> */}
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 dark:text-white ${menu == "account" ? "bg-violet-500 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("account")} >{ <UserIcon size={16}/>  } Account</p>
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 dark:text-white ${menu == "usage" ? "bg-violet-500 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("usage")}>{ <Activity size={16}/>  } Usage</p>
                            <p className={`hover:cursor-pointer flex flex-row items-center gap-2 px-2 py-1 dark:text-white ${menu == "billing" ? "bg-violet-500 text-white rounded-md" : "bg-transparent"}`} onClick={() => setMenu("billing")}>{ <CreditCard size={16}/>  } Billing</p>
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
                                                <div className="w-full sm:w-fit flex flex-col flex-1 gap-2">
                                                    <div>
                                                        <h1 className="font-bold text-xl dark:text-white">{ user?.name }</h1> {/*  <i className="text-sm text-slate-500 not-italic font-light">({ user?.name })</i> */}
                                                        <p className="text-slate-700 dark:text-slate-300">{ session?.data?.user?.email }</p>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between w-full flex-1 sm:flex-grow-0">
                                                        {
                                                            user.accounts[0].type == "credentials" ?
                                                            <Button onClick={() => {
                                                                setChangingPassword({
                                                                    ...changingPassword,
                                                                    state: 1,
                                                                })
                                                            }} icon={<></>} className="h-8 text-base px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer bg-gray-200/60 text-gray-900 hover:bg-gray-200 hover:text-gray-900 dark:bg-white dark:opacity-60 dark:hover:opacity-100">Change Password</Button>
                                                            :
                                                            <></>
                                                        }

                                                        <Button onClick={() => {
                                                            setChangingUsername(true)
                                                        }} icon={<></>} className="h-10 text-base px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer bg-gray-200/60 text-gray-900 hover:bg-gray-200 hover:text-gray-900 dark:bg-white dark:opacity-60 dark:hover:opacity-100">Change Username</Button>
                                                        
                                                        <Button onClick={async () => {
                                                            const data = await signOut({ redirect: false, callbackUrl: window.location.origin });
                                                        }} icon={<></>} className="h-10 text-base px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer bg-gray-200/60 text-gray-900 hover:bg-gray-200 hover:text-gray-900 dark:bg-white dark:opacity-60 dark:hover:opacity-100">Log Out</Button>
                                                        
                                                        <Button onClick={async () => {
                                                            setDeletingAccount(true)
                                                        }} icon={<></>} className="h-10 text-base px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer bg-red-200/60 text-red-900 hover:bg-red-200 hover:text-red-900 ">Delete Account</Button>
                                                    </div>
                                                </div>
                                                
                                                {
                                                    eligibleForDownload == 1 ? 
                                                    <div className="flex flex-row gap-4 px-2 pl-3 py-2 bg-violet-200 dark:bg-violet-800 dark:bg-opacity-40 w-full rounded-xl items-center">
                                                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-violet-500"><Check size={20} color="#fff" /></div>

                                                        <div className="flex flex-col flex-1">
                                                            <h1 className="font-semibold text-violet-900 dark:text-violet-200">You are eligible for Reseda { small ? "" : "Pre-Release" }</h1>
                                                            {/* <p className="text-violet-700">You have been selected to join us in pre-release.</p>  */}
                                                        </div>
                                                        
                                                        <Button className="text-sm text-violet-50 bg-violet-500" href="/download" icon={<ArrowUpRight size={16}/>}>{ small ? "" : "Download" }</Button>
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
                                                
                                                
                                            </div>
                                        )
                                    case "usage":
                                        return (
                                            <div className="flex flex-col items-start h-full flex-1">
                                                <div className="flex sm:flex-row flex-col sm:items-center justify-between w-full">
                                                    <div className="flex sm:flex-col flex-row items-center justify-between sm:py-0 py-5">
                                                        <h1 className="font-bold text-xl dark:text-white">{ new Date().toLocaleString("en-nz", { month: "long" }) } <i className="text-sm text-slate-500 dark:text-slate-300 not-italic font-light">(This Billing Period)</i></h1>
                                                        {/* <p className="text-slate-700"></p> */}
                                                    </div>

                                                    <div className="flex flex-row items-center gap-6">
                                                        <div className="flex flex-row sm:flex-none flex-1 gap-2 items-center bg-[#F8F7F6] dark:bg-[#ffffff3c] rounded-md">
                                                            <div className="bg-[#efedeb] dark:bg-white px-2 py-1 rounded-md flex flex-row items-center sm:gap-4">
                                                                {
                                                                    small ? <div style={{ height: "24px", width: "0px" }}></div> : "Up"
                                                                }
                                                                <ArrowUp size={16} color={"#000"}/>
                                                            </div>
                                                            
                                                            <p className="px-4 font-semibold  dark:text-white">
                                                                { thisMonthData ? getSize(thisMonthData?.up, 2) : "..." }
                                                            </p>
                                                            
                                                        </div>

                                                        <div className="flex flex-row sm:flex-none flex-1 gap-2 items-center bg-[#F8F7F6] dark:bg-[#ffffff3c] rounded-md">
                                                            <div className="bg-[#efedeb] dark:bg-white px-2 py-1 rounded-md flex flex-row items-center sm:gap-4">
                                                                {
                                                                    small ? <div style={{ height: "24px", width: "0px" }}></div> : "Down"
                                                                }
                                                                <ArrowDown size={16} color={"#000"}/>
                                                            </div>

                                                            <p className="px-4 font-semibold dark:text-white">
                                                                { thisMonthData ? getSize(thisMonthData?.down, 2) : "..." }
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
                                            <div className="flex flex-col items-start gap-2">
                                                <h1 className="font-bold text-xl dark:text-white">Billing</h1>

                                                <Billing data={thisMonthData} tier={userInformation?.tier} changeView={setMenu} usage />
                                                {/* <div>
                                                    <div>
                                                        {  }
                                                    </div>
                                                </div> */}
                                                <CurrentPlan tier={userInformation?.tier} limit={userInformation?.limit} callback={() => {
                                                    setChangingLimit({
                                                        ...changingLimit,
                                                        state: true
                                                    });
                                                }} />
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