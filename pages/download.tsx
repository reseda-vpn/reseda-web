import styles from '@styles/Home.module.css'
import { useEffect, useRef, useState } from 'react';
import Header from '@components/header';
import Banner from '@components/banner';
import Button from '@components/un-ui/button';
import Input from '@components/un-ui/input';
import { Gradient } from '@components/gradient'

import Image from 'next/image';
import Footer from '@components/footer';
import { ArrowUpRight, Check, Download, Link } from 'react-feather';
import { motion, useAnimation, useViewportScroll, Variants } from "framer-motion"
import useMediaQuery from '@components/media_query';
import { cardVariants, subTitleControl, titleControl, titleVariants } from '@components/framer_constants';
import Waitlist from '@components/waitlist';
import { FaApple, FaDownload, FaLinux, FaWindows } from "react-icons/fa"


export async function getStaticProps() {
	const metaTags = {
		"og:title": [`Download Reseda`],
		"og:description": ["Reseda VPN is available for windows."],
		"og:url": [`https://reseda.app/download`],
	};

	return {
	  props: {
		metaTags
	  }
	}
}

export default function Home() {
	const small = useMediaQuery(640);
	const [ isTauri, setIsTauri ] = useState(false);

	useEffect(() => {
		let tauri = false;
		
		//@ts-expect-error
		if(window.__TAURI_IPC__ || window.__TAURI__ || window.__TAURI_METADATA__) tauri = true;

        setIsTauri(tauri);

		//@ts-expect-error
		if(window.__TAURI_METADATA__) window.location.href = "./login?t=1";
		
		// Create your instance
		const gradient = new Gradient()

		//@ts-expect-error
		gradient.initGradient('#gradient-canvas')
	}, []);

	return !isTauri ? 
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<Banner title={"💪 Improvements"} text={"Reseda is currently undergoing a major refactor"} url={"https://twitter.com/UnRealG3/status/1490596150944043012?s=20&t=DNFSbVhA3wkoWyVOkwAvxQ"} />

			<div className="flex-col flex font-sans min-h-screen w-screen relative">
				<Header />

				<div className="pt-8 pb-16"></div>

                <div className="flex flex-col gap-2 md:max-w-screen-lg w-full my-0 mx-auto py-2 px-4 max-w-sm relative h-full flex-1" id="vpn">
				    <h1 className="flex text-[2.5rem] font-bold text-slate-800 mb-0 pb-0">Download Reseda</h1>

                    <div className="flex flex-row items-center gap-2">
                        Compatible with 
                        <div className="flex flex-row items-center gap-2 bg-blue-100 rounded-md px-2 py-1 text-blue-800 font-semibold">
                            <FaWindows />
                            <p>Windows</p>

                            <p className="font-light">7, 8, 10, 11</p>
                        </div>
                        {/* ,
                        <div className="flex flex-row items-center gap-2 bg-purple-100 rounded-md px-2 py-1 text-purple-800 font-semibold">
                            <FaLinux />
                            <p>Linux</p>

                        </div>
                        &
                        <div className="flex flex-row items-center gap-2 bg-orange-100 rounded-md px-2 py-1 text-orange-800 font-semibold">
                            <FaApple />
                            <p>MacOS</p>

                            <p className="font-light">Sierra+</p>
                        </div> */}
                    </div>

                    <div>
                        <div className="flex flex-row items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                            <p><strong className="text-violet-500 rounded-sm py-0 px-1" >1GB/s</strong> Speeds to keep up with whatever you do.</p>
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                            <p>Connect in <strong className="text-violet-500 rounded-sm py-0 px-1" >under 2s</strong> with reseda-server technology</p>
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                            <p>Your traffic is <strong className="text-violet-500 rounded-sm py-0 px-1" >encrypted</strong> end-to-end</p>
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                            <p>Keep your location <strong className="text-violet-500 rounded-sm py-0 px-1" >private</strong>, with no DNS leaks.</p>
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                            <p>Stable, Component Based Backend Architecture to keep your connections <strong className="text-violet-500 rounded-sm py-0 px-1" >stable</strong></p>
                        </div>
                    </div>

				    <div className="pt-6 pb-6"></div>
                    
                    <div className="flex flex-col gap-2">
                        <Button icon={false} className="bg-violet-600 text-slate-50 font-semibold text-[1.1rem] px-5 py-3 h-auto w-fit rounded-2xl" >Download app</Button>
                        
                        <p className="text-black flex flex-row items-center text-sm">Don{'\''}t have Reseda? <Button icon={false} href="/signup" className="text-blue-500 text-sm pl-1" >Get Access</Button></p>
                    </div>

                    
                </div>

				<div className="pt-16 pb-16"></div>
				
				<Footer />
			</div>
		</div>
		:
		<></>
}
