import styles from '@styles/Home.module.css'
import { useEffect, useRef, useState } from 'react';
import Header from '@components/header';
import Banner from '@components/banner';
import Button from '@components/un-ui/button';
import Input from '@components/un-ui/input';
import { Gradient } from '@components/gradient'

import Image from 'next/image';
import Footer from '@components/footer';
import { Check } from 'react-feather';
import { motion, useAnimation, useViewportScroll, Variants } from "framer-motion"
import useMediaQuery from '@components/media_query';
import { cardVariants, cardVariantsRight, subTitleControl, titleControl, titleVariants } from '@components/framer_constants';
import Waitlist from '@components/waitlist';
import Billing from '@components/billing';
import BillingCalculator from '@components/calculator';
import { useSession } from 'next-auth/react';

export async function getStaticProps() {
	const metaTags = {
		"og:title": [`Fast. Affordable. Secure. Reseda.`],
		"og:description": ["Reseda boasts up to 1GB/s real world throughput, affordably pricing, and incredible security."],
		"og:url": [`https://reseda.app/`],
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

				<canvas id="gradient-canvas" className="md:top-0" style={{ height: small ? '450px' : '70vh' }} data-transition-in></canvas>

				<div className="flex flex-row items-center h-fill max-w-screen-lg w-full my-0 mx-auto px-4 z-40" style={{ height: small ? '450px' : 'calc(70vh - 48px)' }}>
					<div className="h-fit flex flex-col gap-16 md:gap-8 items-start">
						<div className="z-50 relative flex flex-col gap-2">
							{/* <svg width="50" height="50" viewBox="0 0 138 140" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M137.413 68.6376C137.413 83.3824 137.413 120.965 137.413 133.28C137.413 135.489 135.648 137.254 133.439 137.254C121.449 137.254 85.4452 137.254 68.7966 137.254C30.9008 137.254 0.180084 106.533 0.180084 68.6376C0.180084 30.7417 30.9008 0.0210571 68.7966 0.0210571C106.692 0.0210571 137.413 30.7417 137.413 68.6376Z" fill="url(#paint0_linear_1_30)"/>
								<mask id="mask0_1_30" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="138" height="138">
								<path d="M137.413 68.6376C137.413 86.3911 137.413 137.254 137.413 137.254C137.413 137.254 88.9389 137.254 68.7966 137.254C30.9008 137.254 0.180084 106.533 0.180084 68.6376C0.180084 30.7417 30.9008 0.0210571 68.7966 0.0210571C106.692 0.0210571 137.413 30.7417 137.413 68.6376Z" fill="white"/>
								</mask>
								<g mask="url(#mask0_1_30)">
								<path d="M56.4272 89.6151L43.4008 136.826C43.0494 138.099 44.0076 139.358 45.3288 139.358H92.0377C93.3589 139.358 94.3171 138.099 93.9657 136.826L80.9393 89.6152C80.7 88.7479 79.911 88.1471 79.0113 88.1471H72.694L66.18 88.1469L61.4699 88.1469L58.3551 88.1471C57.4554 88.1471 56.6665 88.7478 56.4272 89.6151Z" fill="white" stroke="white" stroke-width="2"/>
								<circle cx="68.7966" cy="66.5958" r="26.8676" fill="white"/>
								</g>
								<defs>
								<linearGradient id="paint0_linear_1_30" x1="21.5906" y1="26.195" x2="114.37" y2="100.663" gradientUnits="userSpaceOnUse">
								<stop stop-color="#9E88E4"/>
								<stop offset="0.291667" stop-color="#EA67B9"/>
								<stop offset="0.645833" stop-color="#EC3A7B"/>
								<stop offset="1" stop-color="#FDB561"/>
								</linearGradient>
								</defs>
							</svg> */}

							<motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={titleControl} className="text-4xl md:text-5xl font-extrabold m-0 text-slate-100 text-left z-50 flex flex-row flex-wrap gap-4 gap-y-0">
								<motion.div variants={titleVariants}>Reseda. </motion.div>
								<motion.div variants={titleVariants}>But. </motion.div>
								<motion.div variants={titleVariants}>Why?</motion.div>
							</motion.div>
							<p className="text-slate-100 text-left z-50 text-lg sm:text-lg" >A VPN that charges you for what you use, so you never worry about paying too much.</p>
						</div>
						
						<div className="flex flex-col gap-2">
							<h2 className="uppercase text-sm text-slate-100 font-semibold">But why?</h2>
						</div>
					</div>

					<div className='gap-4'></div>
				</div>
				
				<div className="flex flex-col gap-52 pt-32 h-full relative" id="vpn">
					<div style={{ height: 'auto', position: 'relative' }}>
						<motion.div className="flex flex-col md:gap-16 gap-8 md:max-w-screen-lg w-full my-0 mx-auto py-2 px-4 max-w-sm relative"> {/* border-l-2 border-violet-500 sm:border-0 */}
							<motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={subTitleControl} className="flex flex-col z-20">
								<h2 className="text-violet-500">STORY</h2>
								<motion.h1 className="m-0 font-bold text-2xl md:text-3xl" variants={cardVariants}>Passion Project turned Inspiration</motion.h1>
								<motion.p className="text-slate-600 text-base" variants={cardVariants}>From passion project to publicly free VPN</motion.p>
							</motion.div>

							<div className="absolute w-full h-full bg-violet-50 z-0 bg-opacity-80 blur-3xl"></div>
							
							<div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 items-center justify-center z-20">
								<motion.div initial="offscreen" whileInView="onscreen" custom={0} viewport={{ once: true }} variants={cardVariantsRight} className="flex flex-col items-start max-w-xs gap-2 md:h-40">
									<Image src={"/assets/duotone/rocket_purple.svg"} alt={"1GB/s Speeds"} height={45} width={45} className={styles.dtsvg}/>
									<h1 className="font-bold text-slate-800 sm:text-base text-lg">Blazing 1GB/s Speeds</h1> {/* before:h-full before:bg-violet-500 before:absolute relative before:-left-2 md:before:bg-white */}
									<p className="text-sm text-slate-700 text-left">With real world speeds up to <strong className="text-violet-500 rounded-sm py-0 px-1" >1GB/s</strong>, Reseda can handle any task from fast-updates to streaming</p>
								</motion.div>

								<motion.div initial="offscreen" whileInView="onscreen" custom={1} viewport={{ once: true }} variants={cardVariantsRight} className="flex flex-col items-start max-w-xs gap-2 md:h-40">
									<Image src={"/assets/duotone/time_purple.svg"} alt={"<2s Connection"} height={45} width={45} className={styles.dtsvg}/>
									<h1 className="font-bold text-slate-800 sm:text-base text-lg">Incredibly low wait times</h1>
									<p className="text-sm text-slate-900">Connect to in under <strong className="text-violet-500 rounded-sm py-0 px-1" >2s</strong> thanks to the WireGuard&#8482; protocol.</p>
								</motion.div>
								
								<motion.div initial="offscreen" whileInView="onscreen" custom={2} viewport={{ once: true }} variants={cardVariantsRight} className="flex flex-col items-start max-w-xs gap-2 md:h-40">
									<Image src={"/assets/duotone/no_location_purple.svg"} alt={"<2s Connection"} quality={100}  height={45} width={45} className={styles.dtsvg}/>
									<h1 className="font-bold text-slate-800 sm:text-base text-lg">Keep your location private</h1>
									<p className="text-sm text-slate-900 text-left">With a strict, no-tracing policy, be comfortable in knowing Reseda is secure, keeping your location <strong className="text-violet-500 rounded-sm py-0 px-1" >hidden</strong>, and traffic <strong className="text-violet-500 rounded-sm py-0 px-1" >private</strong> </p>
								</motion.div>

								<motion.div initial="offscreen" whileInView="onscreen" custom={3} viewport={{ once: true }} variants={cardVariantsRight} className="flex flex-col items-start max-w-xs gap-2 md:h-40">
									<Image src={"/assets/duotone/component_purple.svg"} alt={"<2s Connection"} height={45} width={45} className={styles.dtsvg}/>
									<h1 className="font-bold text-slate-800 sm:text-base text-lg">Component-Based Backend</h1>
									<p className="text-sm text-slate-900 text-left">Reseda implements safeguards to ensure your connection remains open whilst the server is up.</p>
								</motion.div>
							</div>
						</motion.div>
					</div>
					

					<div className="flex flex-col gap-16 max-w-screen-lg w-full my-0 mx-auto py-2 px-4 relative" id="pricing">
						<motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={subTitleControl} className="flex flex-col items-start sm:items-end z-20">
							<h2 className="text-orange-500">PRICING</h2>
							<motion.h1 className="m-0 font-bold text-2xl md:text-3xl sm:text-right" variants={cardVariants}>Transparent, Affordable Pricing</motion.h1>
							<motion.p className="text-slate-600 text-base sm:text-right" variants={cardVariants}>Pay as you go plans so you know what you{'\''}re paying, before you pay.</motion.p>
						</motion.div>

						<div className="absolute w-full h-full bg-orange-50 z-0 bg-opacity-80 blur-3xl"></div>
						
						<div className="flex flex-row flex-wrap z-20 justify-start sm:justify-around gap-8 sm:gap-0">
							<motion.div initial="offscreen" whileInView="onscreen" custom={0} viewport={{ once: true }} variants={cardVariantsRight} className="rounded-lg sm:h-64 w-64 flex flex-col justify-between gap-6">
								<div>
									<h2 className="text-xl relative after:content-['FREE'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-300">Reseda</h2>
									<h1 className="text-4xl font-semibold">$0.00 <i className="text-base not-italic text-orange-300">/month</i></h1>

									<p className="text-sm text-slate-400">Billing Information Required</p>
								</div>

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
										<div className="text-base text-slate-700">1 Device Max <i className="not-italic text-sm text-slate-400">(at the same time)</i> </div>
									</div>
								</div>
							</motion.div>

							<motion.div initial="offscreen" whileInView="onscreen" custom={1} viewport={{ once: true }} variants={cardVariantsRight} className="rounded-lg sm:h-64 w-64 flex flex-col justify-between gap-6">
								<div>
									<h2 className="text-xl relative after:content-['BASIC'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-400">Reseda</h2>
									<h1 className="text-4xl font-semibold relative">$2.00 <i className="text-base not-italic text-orange-400 no-underline">/100GB</i></h1> {/* after:content-['*'] after:opacity-50 */}

									<p className="text-sm text-slate-400">Costs 2.90/mo @ 150GB used</p>
								</div>

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
							</motion.div>

							<motion.div initial="offscreen" whileInView="onscreen" custom={2} viewport={{ once: true }} variants={cardVariantsRight} className="rounded-lg sm:h-64 w-64 flex flex-col justify-between gap-6">
								<div>
									<h2 className="text-xl relative after:content-['PRO'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-500">Reseda</h2>
									<h1 className="text-4xl font-semibold relative ">$2.40 <i className="text-base not-italic text-orange-500">/100GB</i></h1> {/* after:content-['*'] after:opacity-50 */}

									<p className="text-sm text-slate-400">Costs 3.50/mo @ 150GB used</p>
								</div>

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
							</motion.div>				
						</div>

						<BillingCalculator />
					</div>

					<div className="flex flex-col gap-16 max-w-screen-lg w-full my-0 mx-auto py-2 px-4 relative" id="prerelease">
						<motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={subTitleControl} className="flex flex-col  z-20">
							<h2 className="text-transparent bg-gradient-to-tr bg-clip-text font-semibold">PRE-RELEASE BONUSES</h2>
							<motion.h1 className="m-0 font-bold text-2xl md:text-3xl" variants={cardVariants}>Why Join Reseda in Pre-Release?</motion.h1>
							<motion.p className="text-slate-600 text-base" variants={cardVariants}>Users that join Reseda during Pre-Release receive some awesome bonuses.</motion.p>
						</motion.div>

						{
							//@ts-expect-error
							<div className="absolute w-full h-full bg-gradient-to-tr z-0 bg-opacity-10 blur-3xl" style={{ ["--tw-gradient-stops"]: 'rgba(156, 138, 236, 0.2) 0%, rgba(250, 193, 128, 0.2) 100%' }}></div>
						}
						
						<div className="flex flex-col sm:flex-row justify-between flex-wrap z-20 gap-4 items-start sm:items-center">
							<div className="rounded-lg sm:h-64 w-64 flex flex-col justify-between gap-6 relative text-xl "> {/* before:content-['1.'] before:absolute before:-top-5 before:-left-5 before:font-extrabold before:bg-gradient-to-tr before:text-transparent before:text-sm before:flex before:items-center before:justify-center before:rounded-md before:text-slate-100 before:h-5 before:w-5 */}
								<div>
									<h2 className="text-xl relative after:content-['SUPPORTER'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-300 after:bg-gradient-to-tr after:text-transparent after:bg-clip-text">Reseda</h2>
									<h1 className="text-4xl font-semibold">$0.00 <i className="text-base not-italic text-transparent bg-gradient-to-tr bg-clip-text">/month</i></h1>

									<p className="text-sm text-slate-400">Tier dissolved upon release, holders gain 25% global discount</p>
								</div>

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
							</div>

							<div className="flex flex-col flex-1 max-w-xl text-justify gap-4">
								<p className="text-slate-600">Joining in pre-release gives you access to the reseda <strong className="bg-gradient-to-tr text-transparent bg-clip-text rounded-sm py-0 px-1" >supporter</strong> tier. Whilst in development, as a supporter - you can reap 50GB free data, and an uncapped data transfer rate. Supporting as many devices as you want at the same time. All for the low cost of $0.00. <i className="text-slate-400 not-italic text-sm">*Requires Waitlist Acceptance (Multi-Accounts not permitted)</i></p>

								<Button className="h-10 w-fit border-2 border-gray-300 text-base px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer bg-gray-200/60 text-gray-900 hover:bg-gray-200 hover:text-gray-900" onClick={() => {
									document.getElementById("waitlistInput").focus();
								}}>
									Get Reseda
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div className="pt-16 pb-16"></div>
				
				<Footer />
			</div>
		</div>
		:
		<></>
}
