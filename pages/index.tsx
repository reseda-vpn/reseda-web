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

export async function getServerSideProps() {
	const metaTags = {
		"og:title": `Fast. Affordable. Secure`,
		"og:description": "Reseda is boasts up to 1GB/s real world throughput, affordably pricing, and incredible security",
		"og:url": `https://reseda.app/`,
	};
	return {
	  props: {
		metaTags
	  }
	}
  }

export default function Home() {
	const small = useMediaQuery(640);

	useEffect(() => {
          // Create your instance
          const gradient = new Gradient()
  
          // Call `initGradient` with the selector to your canvas

		  //@ts-expect-error
          gradient.initGradient('#gradient-canvas')
	}, []);

	const subTitleControl: Variants = {
		offscreen: { opacity: 0, y: 20, },
		onscreen: {
			opacity: 1,
			y: 0,
			transition: {
				staggerChildren: 0.5,
				type: "spring",
				bounce: 0.2,
				duration: 0.5,
				delay: 0.3
			}
		}
	}

	const titleControl: Variants = {
		offscreen: { opacity: 0, y: 20, },
		onscreen: {
			opacity: 1,
			y: 0,
			transition: {
				staggerChildren: 0.6,
				type: "tween",
				ease: "easeOut",
				duration: 0.4,
				delay: 0.2
			}
		}
	}

	const titleVariants: Variants = {
		offscreen: {
			opacity: 0,
			y: 20
		},
		onscreen: {
			opacity: 1,
			y: 0,
			transition: {
				type: "tween",
				ease: "easeOut",
				duration: 0.4,
			}
		}
	}

	const cardVariants: Variants = {
		offscreen: {
		  	opacity: 0,
			y: 20
		},
		onscreen: {
		 	opacity: 1,
			y: 0,
			transition: {
				type: "tween",
				ease: "easeOut",
				duration: 0.4,
			}
		}
	};

	return (
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<Banner title={"💪 Support"} text={"Reseda is releasing support for MacOS and Linux"} url={""} />

			<div className="flex-col flex font-sans min-h-screen w-screen relative">
				<Header />

				<canvas id="gradient-canvas" className="md:top-0" data-transition-in></canvas>

				<div className="flex flex-row items-center h-fill max-w-screen-lg w-full my-0 mx-auto px-4 z-40" style={{ height: small ? '450px' : '800px' }}>
					<div className="h-fit flex flex-col gap-16 md:gap-8 items-start">
						<div className="z-50 relative flex flex-col gap-2">
							<motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={titleControl} className="text-4xl md:text-5xl font-extrabold m-0 text-slate-100 text-left z-50 flex flex-row flex-wrap gap-4 gap-y-0">
								<motion.div variants={titleVariants}>Fast. </motion.div>
								<motion.div variants={titleVariants}>Affordable. </motion.div>
								<motion.div variants={titleVariants}>Secure.</motion.div>
							</motion.div>
							<p className="text-slate-100 text-left z-50 text-lg sm:text-lg" >A VPN that charges you for what you use, so you never worry about paying too much.</p>
						</div>
						
						<div className="flex flex-col gap-2">
							<h2 className="uppercase text-sm text-slate-100 font-semibold">Join the waitlist</h2>

							<div className="flex flex-row align-center justify-center" id="waitlist">
								<Input  
									id="waitlistInput"
									placeholder='Email'
									callback={(email, ui_callback) => {
										fetch('/api/create_lead', {
											body: email,
											method: 'POST'
										})
											.then(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); })
											.catch(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); });
									}}>	
								</Input>
							</div>
						</div>
					</div>

					{/* <div className={styles.resedaFancyConnection}>
						<div>
							<span className={styles.connectedToServerOuter}>
								<span className={styles.connectedToServerInner}>
									<span style={{ backgroundSize: '400%', animationDuration: '10s' }} >
										R
									</span>
								</span>
							</span>
						</div>
					</div> */}

					<div className='gap-4'></div>
				</div>
				
				<div className="flex flex-col gap-52 pt-32 h-full relative" id="vpn">
					<div style={{ height: 'auto', position: 'relative' }}>
						<motion.div className="flex flex-col md:gap-16 gap-8 md:max-w-screen-lg w-full my-0 mx-auto py-2 px-4 max-w-sm relative"> {/* border-l-2 border-violet-500 sm:border-0 */}
							<motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={subTitleControl} className="flex flex-col z-20">
								<h2 className="text-violet-500">VPN</h2>
								<motion.h1 className="m-0 font-bold text-2xl md:text-3xl" variants={cardVariants}>Reseda is Blazing Fast, and Incredibly Secure</motion.h1>
								<motion.p className="text-slate-600 text-base" variants={cardVariants}>Reseda is fast, easy to use and private. </motion.p>
							</motion.div>

							<div className="absolute w-full h-full bg-violet-50 z-0 bg-opacity-80 blur-3xl"></div>
							
							<div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 items-center justify-center z-20">
								<div className="flex flex-col items-start max-w-xs gap-2 md:h-40">
									<Image src={"/assets/duotone/rocket_purple.svg"} alt={"1GB/s Speeds"} height={45} width={45} className={styles.dtsvg}/>
									<h1 className="font-bold text-slate-800 sm:text-base text-lg">Blazing 1GB/s Speeds</h1> {/* before:h-full before:bg-violet-500 before:absolute relative before:-left-2 md:before:bg-white */}
									<p className="text-sm text-slate-700 text-left">With real world speeds up to <strong className="text-violet-500 rounded-sm py-0 px-1" >1GB/s</strong>, Reseda can handle any task from fast-updates to streaming</p>
								</div>

								<div className="flex flex-col items-start max-w-xs gap-2 md:h-40">
									<Image src={"/assets/duotone/time_purple.svg"} alt={"<2s Connection"} height={45} width={45} className={styles.dtsvg}/>
									<h1 className="font-bold text-slate-800 sm:text-base text-lg">Incredibly low wait times</h1>
									<p className="text-sm text-slate-900">Connect to in under <strong className="text-violet-500 rounded-sm py-0 px-1" >2s</strong> thanks to the WireGuard&#8482; protocol.</p>
								</div>
								
								<div className="flex flex-col items-start max-w-xs gap-2 md:h-40">
									<Image src={"/assets/duotone/no_location_purple.svg"} alt={"<2s Connection"} quality={100}  height={45} width={45} className={styles.dtsvg}/>
									<h1 className="font-bold text-slate-800 sm:text-base text-lg">Keep your location private</h1>
									<p className="text-sm text-slate-900 text-left">With a strict, no-tracing policy, be comfortable in knowing Reseda is secure, keeping your location <strong className="text-violet-500 rounded-sm py-0 px-1" >hidden</strong>, and traffic <strong className="text-violet-500 rounded-sm py-0 px-1" >private</strong> </p>
								</div>

								<div className="flex flex-col items-start max-w-xs gap-2 md:h-40">
									<Image src={"/assets/duotone/component_purple.svg"} alt={"<2s Connection"} height={45} width={45} className={styles.dtsvg}/>
									<h1 className="font-bold text-slate-800 sm:text-base text-lg">Component-Based Backend</h1>
									<p className="text-sm text-slate-900 text-left">Reseda implements safeguards to ensure your connection remains open whilst the server is up.</p>
								</div>
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
							<div className="rounded-lg sm:h-64 w-64 flex flex-col justify-between gap-6">
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
							</div>

							<div className="rounded-lg sm:h-64 w-64 flex flex-col justify-between gap-6">
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
							</div>

							<div className="rounded-lg sm:h-64 w-64 flex flex-col justify-between gap-6">
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
							</div>				
						</div>
					</div>

					<div className="flex flex-col gap-16 max-w-screen-lg w-full my-0 mx-auto py-2 px-4 relative">
						<motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={subTitleControl} className="flex flex-col  z-20">
							<h2 className="text-transparent bg-gradient-to-tr bg-clip-text font-semibold">PRE-RELEASE BONUSES</h2>
							<motion.h1 className="m-0 font-bold text-2xl md:text-3xl" variants={cardVariants}>Why Join Reseda in Pre-Release?</motion.h1>
							<motion.p className="text-slate-600 text-base" variants={cardVariants}>Users that join Reseda during Pre-Release receive some awesome bonuses.</motion.p>
						</motion.div>

						{
							//@ts-expect-error
							<div className="absolute w-full h-full bg-gradient-to-tr z-0 bg-opacity-10 blur-3xl" style={{ ["--tw-gradient-stops"]: 'rgba(156, 138, 236, 0.2) 0%, rgba(250, 193, 128, 0.2) 100%' }}></div>
						}
						
						<div className="flex flex-col sm:flex-row justify-between flex-wrap z-20 gap-4 items-start">
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

								<Button onClick={() => {
									document.getElementById("waitlistInput").focus();
								}}>
									Get Reseda
								</Button>

								{/* <div className="hidden md:flex flex-col">
									<h2 className="uppercase text-sm text-slate-700 font-semibold">Join the waitlist</h2>

									<Input  
										placeholder='Email'
										callback={(email, ui_callback) => {
											fetch('/api/create_lead', {
												body: email,
												method: 'POST'
											})
												.then(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); })
												.catch(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); });
										}}>	
									</Input>
								</div> */}
							</div>
						</div>
					</div>
				</div>

				<div className="pt-16 pb-16"></div>
				
				<Footer />
			</div>
			
		</div>
	)
}
