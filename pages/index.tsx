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
				delay: 0.5
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

	const closeReveal: Variants = {
		firstPageOn: {
			position: 'fixed',
			transform: 'translate(-50%, -50%)',
			top: '50%',
			left: '50%',
			width: '100%',
			transition: {
				type: "tween",
				duration: 0
			}
		},
		firstPageOff: {
			position: 'static',
			transform: 'translate(0px, 0px)',
			transition: {
				type: "tween",
				duration: 0
			}
		},
		firstPageEnd: {
			position: 'fixed',
			transform: 'translate(-50%, -50%)',
			top: '50%',
			left: '50%',
			width: '100%',
			transition: {
				type: "tween",
				duration: 0
			}
		}
	}

	const scroll_position = useViewportScroll();
	const controls = useAnimation();
	const firstPageRef = useRef<HTMLDivElement>();

	// useEffect(() => {
	// 	const update = () => {
	// 		if(firstPageRef?.current.getBoundingClientRect().top < 328 && firstPageRef?.current.getBoundingClientRect().bottom > 328) {
	// 			controls.start('firstPageOn');
	// 		}else if(firstPageRef?.current.getBoundingClientRect().bottom < 328){
	// 			controls.start('firstPageEnd');
	// 		}else {
	// 			controls.start('firstPageOff');
	// 		}
	
	// 		console.log(firstPageRef?.current.offsetTop);
	// 	}
	
	// 	scroll_position.scrollY.onChange(update)
	// }, [controls, scroll_position.scrollY]);
	
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

							<div className="flex flex-row align-center justify-center">
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
				
				<div className="flex flex-col gap-52 pt-32 h-full relative">
					<div style={{ height: 'auto', position: 'relative' }} ref={firstPageRef}>
						<motion.div  initial="firstPageOff" animate={controls} variants={closeReveal} className="flex flex-col md:gap-16 gap-8 md:max-w-screen-lg w-full my-0 mx-auto py-2 px-4 max-w-sm relative"> {/* border-l-2 border-violet-500 sm:border-0 */}
							<motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={subTitleControl} className="flex flex-col z-20">
								<h2 className="text-violet-500">VPN</h2>
								<motion.h1 className="m-0 font-bold text-2xl md:text-3xl" variants={cardVariants}>Reseda is Blazing Fast, and Incredibly Secure</motion.h1>
								<motion.p className="text-slate-600 text-base" variants={cardVariants}>Reseda is fast, easy to use and private. </motion.p>
							</motion.div>

							<div className="absolute -rotate-6 w-full h-full bg-violet-100 z-0 bg-opacity-80"></div>
							
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
					

					<div className="flex flex-col gap-16 max-w-screen-lg w-full my-0 mx-auto py-2 px-4 relative">
						<motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={subTitleControl} className="flex flex-col items-end z-20">
							<h2 className="text-orange-500">PRICING</h2>
							<motion.h1 className="m-0 font-bold text-2xl md:text-3xl text-right" variants={cardVariants}>Transparent, Affordable Pricing</motion.h1>
							<motion.p className="text-slate-600 text-base text-right" variants={cardVariants}>Pay as you go plans so you know what you{'\''}re paying, before you pay.</motion.p>
						</motion.div>
						
						<div className="flex flex-row justify-around flex-wrap z-20">
							<div className="rounded-lg h-64 w-64 flex flex-col justify-between gap-6">
								<div>
									<h2 className="text-xl">Free</h2>
									<h1 className="text-4xl font-semibold">$0.00 <i className="text-base not-italic text-orange-300">/month</i></h1>

									<p className="text-sm text-slate-400">No Credit Card Required</p>
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

							<div className="rounded-lg h-64 w-64 flex flex-col justify-between gap-6">
								<div>
									<h2 className="text-xl">Reseda</h2>
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

							<div className="rounded-lg h-64 w-64 flex flex-col justify-between gap-6">
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
				</div>

				<div className="pt-16 pb-16"></div>
				
				<Footer />
			</div>
			
		</div>
	)
}
