import { useEffect, useRef, useState } from 'react';
import Header from '@components/header';
import { Gradient } from '@components/gradient'
import Input from '@components/un-ui/input';
import InputField from '@components/un-ui/input_field';
import Button from '@components/un-ui/button';
import { motion, useAnimation, useViewportScroll, Variants } from "framer-motion"
import { cardVariants, subTitleControl } from '@components/framer_constants';
import { supabase } from '@root/client';
import { AlertCircle, ArrowRight, Check } from 'react-feather';
import Router, { useRouter } from 'next/router';

export default function Home() {
    const [ authInformation, setAuthInformation ] = useState({
        email: "",
        password: ""
    });

    const router = useRouter();

    const [ awaitingReply, setAwaitingReply ] = useState(false);
    const [ authFailure, setAuthFailure ] = useState("");
    const [ authSuccess, setAuthSuccess ] = useState<"logged_out" | "logged_in" | "login_failure">("logged_out");

	useEffect(() => {
        // Create your instance
        const gradient = new Gradient()

        // Call `initGradient` with the selector to your canvas

        //@ts-expect-error
        gradient.initGradient('#gradient-canvas')
	}, []);

    const signIn = () => {
        setAwaitingReply(true);

        supabase.auth.signIn({
            ...authInformation
        }).then(res => {                                                
            if(res.error) {
                setAuthFailure(res.error.message);
                setAuthSuccess("login_failure");
                setAwaitingReply(false);
            }
            else {
                setAwaitingReply(false);
                setAuthSuccess("logged_in");
                router.push('/profile');
            }
        })
    }

	return (
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<div className="flex-col flex font-sans min-h-screen w-screen relative overflow-hidden">
				<canvas id="gradient-canvas" className="md:top-0 w-full z-10 absolute h-screen" style={{ width: '200%', height: '200%' }} data-transition-in></canvas>

                <div className="flex-row flex-1 w-screen h-full grid sm:grid-cols-3">
                    <div className="w-full bg-white z-20 flex justify-center items-center flex-col sm:p-72">
                        <div className="flex flex-col flex-1 gap-8 justify-center">
                            <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={subTitleControl}>
                                <h2 className="font-bold font-altSans text-lg text-slate-400">RESEDA</h2>
                                <motion.h1 variants={cardVariants} className="m-0 font-bold text-2xl md:text-3xl">Login</motion.h1>
                                <motion.p  variants={cardVariants} className="text-slate-600 text-base">It{'\''}s great to have you here!</motion.p>
                            </motion.div>

                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm uppercase text-slate-500">Email</p>
                                    <InputField
                                        placeholder='Email'
                                        type="email"
                                        callback={(email) => {
                                            setAuthInformation({
                                                ...authInformation,
                                                email
                                            })
                                        }}
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm uppercase text-slate-500">Password</p>
                                    <InputField
                                        type="password"
                                        placeholder='Password'
                                        callback={(password) => {
                                            setAuthInformation({
                                                ...authInformation,
                                                password
                                            })
                                        }}
                                        enterCallback={signIn}
                                    />
                                </div>
                            </div>

                                    {/* Style This! */}
                            {
                                authSuccess == "login_failure" ? (
                                    <div className="flex flex-row gap-4 items-center rounded-2xl rounded-r-lg">
                                        <div className="flex items-center justify-center bg-red-100 rounded-full h-8 w-8">
                                            <p className="text-red-500 font-bold font-altSans">!</p>
                                        </div>

                                        <p className="text-red-500 text-base font-base font-sans">
                                            { authFailure }
                                        </p>
                                    </div>
                                ) : <></>
                            }
                            
                            <div className="flex flex-row justify-between">
                                <Button 
                                    className=" bg-violet-600 text-slate-50 w-fit font-semibold"
                                    loaderOnly={awaitingReply}
                                    icon={authSuccess == "logged_in" ? <Check size={16}/> : <ArrowRight size={16} />}
                                    onClick={signIn}
                                >
                                    {
                                        awaitingReply ?
                                            "Loading"
                                        :
                                            authSuccess == "logged_in" ?
                                            "Success"
                                            :
                                            authSuccess == "login_failure" ?
                                            "Login" // "Failed"
                                            :
                                            "Login"
                                    }
                                </Button>
                                <Button icon={false} className="bg-transparent text-violet-500 w-fit font-semibold">No Account?</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</div>
	)
}
