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
		<div className="flex-col flex font-sans min-h-screen dark:bg-[#05010d]" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<Banner title={"💪 Improvements"} text={"Reseda is currently undergoing a major refactor"} url={"https://twitter.com/UnRealG3/status/1490596150944043012?s=20&t=DNFSbVhA3wkoWyVOkwAvxQ"} />

			<div className="flex-col flex font-sans min-h-screen w-screen relative">
				<Header />

                {/*
                <svg width="1048" height="1076" fill="none" xmlns="http://www.w3.org/2000/svg" className="Hero_stars__y5lHs absolute"><g style={{ mixBlendMode: "overlay" }}><g filter="url(#stars_svg__a)"><path d="m524 256 3.263 304.137L653.41 266.904 533.567 561.218 774 298.872 539.219 563.306l338.334-213.58L543.834 566.26 957.013 416 547.097 569.877l459.863-76.699-458.174 80.734L1024 576l-475.214 2.088 458.174 80.734-459.863-76.699L957.013 736 543.834 585.74l333.719 216.534-338.334-213.58L774 853.128 533.567 590.782 653.41 885.096 527.263 591.863 524 896l-3.263-304.137L394.59 885.096l119.843-294.314L274 853.128l234.781-264.434-338.334 213.58L504.166 585.74 90.987 736l409.916-153.877-459.866 76.699 458.177-80.734L24 576l475.214-2.088-458.177-80.734 459.866 76.699L90.987 416l413.179 150.26-333.719-216.534 338.334 213.58L274 298.872l240.433 262.346L394.59 266.904l126.147 293.233L524 256Z" fill="#fff"></path></g><g filter="url(#stars_svg__b)"><path stroke="url(#stars_svg__c)" stroke-width="3" stroke-linecap="round" d="m652.842 453.212 28.455-33.054"></path></g><g filter="url(#stars_svg__d)"><path stroke="url(#stars_svg__e)" stroke-width="3" stroke-linecap="round" d="m647.283 515.501 71.831-54.784"></path></g><g filter="url(#stars_svg__f)"><path stroke="url(#stars_svg__g)" stroke-width="3" stroke-linecap="round" d="m401.519 510.06-73.183-52.965"></path></g><g filter="url(#stars_svg__h)"><path stroke="url(#stars_svg__i)" stroke-width="3" stroke-linecap="round" d="m484.752 489.931-25.916-35.08"></path></g><g filter="url(#stars_svg__j)"><path stroke="url(#stars_svg__k)" stroke-width="3" stroke-linecap="round" d="m384.199 434.55-30.24-31.429"></path></g><g filter="url(#stars_svg__l)"><path stroke="url(#stars_svg__m)" stroke-width="3" stroke-linecap="round" d="m568.275 487.245 18.45-39.52"></path></g><g filter="url(#stars_svg__n)"><path stroke="url(#stars_svg__o)" stroke-width="3" stroke-linecap="round" d="m526.675 519.201 1.088-33.001"></path></g></g><defs><filter id="stars_svg__a" x="0" y="232" width="1048" height="688" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="12" result="effect1_foregroundBlur_440:32428"></feGaussianBlur></filter><filter id="stars_svg__b" x="649.342" y="416.658" width="35.455" height="40.054" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_440:32428"></feGaussianBlur></filter><filter id="stars_svg__d" x="643.783" y="457.217" width="78.831" height="61.784" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_440:32428"></feGaussianBlur></filter><filter id="stars_svg__f" x="324.836" y="453.595" width="80.183" height="59.966" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_440:32428"></feGaussianBlur></filter><filter id="stars_svg__h" x="455.336" y="451.352" width="32.916" height="42.08" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_440:32428"></feGaussianBlur></filter><filter id="stars_svg__j" x="350.459" y="399.621" width="37.24" height="38.429" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_440:32428"></feGaussianBlur></filter><filter id="stars_svg__l" x="564.775" y="444.224" width="25.45" height="46.522" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_440:32428"></feGaussianBlur></filter><filter id="stars_svg__n" x="523.175" y="482.7" width="8.088" height="40.002" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_440:32428"></feGaussianBlur></filter><linearGradient id="stars_svg__c" x1="682.035" y1="418.348" x2="651.623" y2="453.676" gradientUnits="userSpaceOnUse"><stop offset="0.071" stop-color="#fff" stop-opacity="0"></stop><stop offset="0.495" stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></linearGradient><linearGradient id="stars_svg__e" x1="720.492" y1="458.884" x2="646.276" y2="515.488" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity="0"></stop><stop offset="0.495" stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></linearGradient><linearGradient id="stars_svg__g" x1="326.184" y1="456.304" x2="401.797" y2="511.028" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity="0"></stop><stop offset="0.495" stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></linearGradient><linearGradient id="stars_svg__i" x1="457.235" y1="453.73" x2="484.934" y2="491.223" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity="0"></stop><stop offset="0.495" stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></linearGradient><linearGradient id="stars_svg__k" x1="352.227" y1="402.216" x2="384.547" y2="435.807" gradientUnits="userSpaceOnUse"><stop offset="0.071" stop-color="#fff" stop-opacity="0"></stop><stop offset="0.495" stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></linearGradient><linearGradient id="stars_svg__m" x1="586.946" y1="445.783" x2="567.227" y2="488.021" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity="0"></stop><stop offset="0.495" stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></linearGradient><linearGradient id="stars_svg__o" x1="527.2" y1="484.407" x2="526.014" y2="520.407" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity="0"></stop><stop offset="0.495" stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></linearGradient></defs></svg>
                */}

                {
                   

                }

                <canvas
                    id="gradient-canvas" className="md:top-0 "
                    style={{
                    height: small ? '450px' : '70vh',
                }}
                    data-transition-in>

                </canvas>

               <div className="flex flex-row items-center h-fill max-w-screen-lg w-full my-0 mx-auto px-4 z-40 dark:bg-[#05010d]" style={{ height: small ? '450px' : 'calc(70vh - 48px)' }}>
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

                            {
                                small ?
                                     <div>
                                         <p className="text-4xl md:text-5xl font-extrabold m-0 text-slate-100 text-left z-50 flex flex-row flex-wrap gap-4 gap-y-0 ">Fast. Affordable. Secure.</p>
                                     </div>
                                :
                                    <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={small ? {} : titleControl} className="text-4xl md:text-5xl font-extrabold m-0 text-slate-100 text-left z-50 flex flex-row flex-wrap gap-4 gap-y-0 ">
                                        <motion.div variants={small ? {} : titleVariants} >Fast. </motion.div>
                                        <motion.div variants={small ? {} : titleVariants} >Affordable. </motion.div>
                                        <motion.div variants={small ? {} : titleVariants} >Secure.</motion.div>
                                    </motion.div>
                            }
							<p className="text-slate-100 text-left z-50 text-lg sm:text-lg" >A VPN that charges you for what you use, so you never worry about paying too much.</p>
						</div>
						
						<div className="flex flex-col gap-2">
							<h2 className="uppercase text-sm text-slate-100 font-semibold">Join the waitlist</h2>
								
							<Waitlist />
						</div>
					</div>

					<div className='gap-4'></div>
				</div>
				
                <div className="dark:bg-[#05010d] flex flex-col gap-52 pt-32 h-full relative" id="vpn">
					<div style={{ height: 'auto', position: 'relative' }}>
						<div className="flex flex-col md:gap-16 gap-8 md:max-w-screen-lg w-full my-0 mx-auto py-2 px-4 max-w-sm relative"> {/* border-l-2 border-violet-500 sm:border-0 */}
                            <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={!small ? subTitleControl : { onscreen: { opacity: 1 } }} className="flex flex-col z-20">
								<h2 className="text-violet-500">VPN</h2>
								<motion.h1 className="m-0 font-bold text-2xl md:text-3xl dark:text-white" variants={cardVariants}>Reseda is Blazing Fast, and Incredibly Secure</motion.h1>
                                <motion.p className="text-slate-600 text-base dark:text-slate-100 dark:!opacity-40" variants={cardVariants}>Reseda is fast, easy to use and private. </motion.p>
							</motion.div>

							<div className="absolute w-full h-full bg-violet-50 z-0 bg-opacity-80 blur-3xl dark:bg-opacity-20 dark:bg-violet-600"></div>
							
							<div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 items-center justify-center z-20">
                                <motion.div initial="offscreen" whileInView="onscreen" custom={0} viewport={{ once: true }} variants={small ? { onscreen: { opacity: 1, x: 0 } } : cardVariantsRight} className="flex flex-col items-start max-w-xs gap-2 md:h-[225px] dark:bg-[#ffffff0d] bg-[#0000000d] p-5 rounded-lg hover:!opacity-100 ease-in-out duration-500">
                                    <Image src={"/assets/duotone/speedometer-03.svg"} alt={"1GB/s Speeds"} height={45} width={45} className={styles.dtsvg}/>
									<h1 className="font-bold text-slate-800 sm:text-base text-lg dark:text-white">Blazing 1GB/s Speeds</h1> {/* before:h-full before:bg-violet-500 before:absolute relative before:-left-2 md:before:bg-white */}
                                    <p className="text-sm text-slate-700 text-left dark:text-slate-300">With real world speeds up to <strong className="text-violet-500 rounded-sm py-0 px-0" >1GB/s</strong>, Reseda can handle any task from fast-updates to streaming</p>
								</motion.div>

                                <motion.div initial="offscreen" whileInView="onscreen" custom={1} viewport={{ once: true }} variants={small ? { onscreen: { opacity: 1, x: 0 } } : cardVariantsRight} className="flex flex-col items-start max-w-xs gap-2 md:h-[225px] dark:bg-[#ffffff0d] bg-[#0000000d] p-5 rounded-lg hover:!opacity-100 ease-in-out duration-500">
									<Image src={"/assets/duotone/hourglass-03.svg"} alt={"<2s Connection"} height={45} width={45} className={styles.dtsvg}/>
                                    <h1 className="font-bold text-slate-800 sm:text-base text-lg dark:text-white">Low connection time</h1>
                                    <p className="text-sm text-slate-900 dark:text-slate-300">Connect to in under <strong className="text-violet-500 rounded-sm py-0 px-0" >2s</strong> thanks to the WireGuard&#8482; protocol.</p>
								</motion.div>
								
                                <motion.div initial="offscreen" whileInView="onscreen" custom={2} viewport={{ once: true }} variants={small ? { onscreen: { opacity: 1, x: 0 } } : cardVariantsRight} className="flex flex-col items-start max-w-xs gap-2 md:h-[225px] dark:bg-[#ffffff0d] bg-[#0000000d] p-5 rounded-lg hover:!opacity-100 ease-in-out duration-500">
                                    <Image src={"/assets/duotone/navigation-pointer-off-01.svg"} alt={"<2s Connection"} quality={100}  height={45} width={45} className={styles.dtsvg}/>
                                    <h1 className="font-bold text-slate-800 sm:text-base text-lg dark:text-white">Private location</h1>
                                    <p className="text-sm text-slate-900 text-left dark:text-slate-300">Be comfortable in knowing Reseda is secure, keeping your location <strong className="text-violet-500 rounded-sm py-0 px-0" >hidden</strong>, and traffic <strong className="text-violet-500 rounded-sm py-0 px-0" >private</strong>.</p>
								</motion.div>

                                <motion.div initial="offscreen" whileInView="onscreen" custom={3} viewport={{ once: true }} variants={small ? { onscreen: { opacity: 1, x: 0 } } : cardVariantsRight} className="flex flex-col items-start max-w-xs gap-2 md:h-[225px] dark:bg-[#ffffff0d] bg-[#0000000d] p-5 rounded-lg hover:!opacity-100 ease-in-out duration-500">
									<Image src={"/assets/duotone/cube-02.svg"} alt={"<2s Connection"} height={45} width={45} className={styles.dtsvg}/>
                                    <h1 className="font-bold text-slate-800 sm:text-base text-lg dark:text-white">Component-Based Backend</h1>
                                    <p className="text-sm text-slate-900 text-left dark:text-slate-300">Reseda implements safeguards to ensure your connection remains open whilst the server is up.</p>
								</motion.div>
							</div>
						</div>
					</div>
					

					<div className="flex flex-col gap-16 max-w-screen-lg w-full my-0 mx-auto py-2 px-4 relative" id="pricing">
                        <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={!small ? subTitleControl : { onscreen: { opacity: 1 } }} className="flex flex-col items-start sm:items-end z-20">
							<h2 className="text-orange-500">PRICING</h2>
							<motion.h1 className="m-0 font-bold text-2xl md:text-3xl sm:text-right dark:text-white" variants={cardVariants}>Transparent, Affordable Pricing</motion.h1>
                            <motion.p className="text-slate-600 text-base sm:text-right dark:text-slate-100 dark:!opacity-40" variants={cardVariants}>Pay as you go plans so you know what you{'\''}re paying, before you pay.</motion.p>
						</motion.div>

						<div className="absolute w-full h-full bg-orange-50 z-0 bg-opacity-80 dark:bg-opacity-20 dark:bg-orange-400 blur-3xl"></div>
						
						<div className="flex flex-row flex-wrap z-20 justify-start sm:justify-around gap-8 sm:gap-0">
                            <motion.div initial="offscreen" whileInView="onscreen" custom={0} viewport={{ once: true }} variants={cardVariantsRight} className="rounded-lg md:h-72 w-64 md:w-72 flex flex-col justify-between gap-6 bg-[#ffffff0d] p-8 rounded-lg hover:!opacity-100 ease-in-out duration-500 ">
								<div>
									<h2 className="text-xl dark:text-white relative after:content-['FREE'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-300">Reseda</h2>
                                    <h1 className="text-4xl dark:text-white font-semibold">$0.00 <i className="text-base not-italic text-orange-300">/month</i></h1>

									<p className="text-sm text-slate-400">Billing Information Required</p>
								</div>

								<div className="flex flex-col flex-1">	
									<div className="flex flex-row gap-2 items-center">
										<div className="h-4 w-4 rounded-full bg-orange-300 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">5GB/mo Free</div>
									</div>
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-orange-300 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300"><strong className="text-orange-300 rounded-sm py-0 px-1" >50MB/s</strong> Transfer</div>
									</div>
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-orange-300 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">1 Device</div>
									</div>
								</div>
							</motion.div>

                            <motion.div initial="offscreen" whileInView="onscreen" custom={1} viewport={{ once: true }} variants={cardVariantsRight} className="rounded-lg md:h-72 w-64 md:w-72 flex flex-col justify-between gap-6 bg-[#ffffff0d] p-8 rounded-lg hover:!opacity-100 ease-in-out duration-500">
								<div>
                                    <h2 className="text-xl dark:text-white relative after:content-['BASIC'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-400">Reseda</h2>
                                    <h1 className="text-4xl dark:text-white font-semibold relative">$2.00 <i className="text-base not-italic text-orange-400 no-underline">/100GB</i></h1> {/* after:content-['*'] after:opacity-50 */}

									<p className="text-sm text-slate-400">Costs 2.90/mo @ 150GB used</p>
								</div>

								<div className="flex flex-col flex-1">	
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-orange-400 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">First 5GB/mo Free</div>
									</div>
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-orange-400 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">Unlimited Data Cap</div>
									</div>
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-orange-400 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300"><strong className="text-orange-400 rounded-sm py-0 px-1" >500MB/s</strong> Max Transfer</div>
									</div>
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-orange-400 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">5 Devices</div>
									</div>
								</div>
							</motion.div>

                            <motion.div initial="offscreen" whileInView="onscreen" custom={2} viewport={{ once: true }} variants={cardVariantsRight} className="rounded-lg sm:h-64 md:h-72 w-64 md:w-72 flex flex-col justify-between gap-6 bg-[#ffffff0d] p-8 rounded-lg hover:!opacity-100 ease-in-out duration-500">
								<div>
                                    <h2 className="text-xl dark:text-white relative after:content-['PRO'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-500">Reseda</h2>
                                    <h1 className="text-4xl dark:text-white font-semibold relative ">$2.40 <i className="text-base not-italic text-orange-500">/100GB</i></h1> {/* after:content-['*'] after:opacity-50 */}

									<p className="text-sm text-slate-400">Costs 3.50/mo @ 150GB used</p>
								</div>

								<div className="flex flex-col flex-1">	
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">First 5GB/mo Free</div>
									</div>
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">Unlimited Data Cap</div>
									</div>
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">Up to <strong className="text-orange-500 rounded-sm py-0 px-1" >1GB/s</strong> Transfer</div>
									</div>
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">Unlimited Devices</div>
									</div>
								</div>
							</motion.div>				
						</div>

						<BillingCalculator />
					</div>

					<div className="flex flex-col gap-16 max-w-screen-lg w-full my-0 mx-auto py-2 px-4 relative" id="prerelease">
                        <motion.div initial="offscreen" whileInView="onscreen" viewport={{ once: true }} variants={!small ? subTitleControl : { onscreen: { opacity: 1 } }} className="flex flex-col  z-20">
							<h2 className="text-transparent bg-gradient-to-tr bg-clip-text font-semibold">PRE-RELEASE BONUSES</h2>
                            <motion.h1 className="m-0 font-bold text-2xl md:text-3xl dark:text-white" variants={cardVariants}>Why Join Reseda in Pre-Release?</motion.h1>
							<motion.p className="text-slate-600 text-base dark:text-slate-100 dark:!opacity-40" variants={cardVariants}>Users that join Reseda during Pre-Release receive some awesome bonuses.</motion.p>
						</motion.div>

						{
							//@ts-expect-error
							<div className="absolute w-full h-full bg-gradient-to-tr z-0 bg-opacity-10 blur-3xl" style={{ ["--tw-gradient-stops"]: 'rgba(156, 138, 236, 0.2) 0%, rgba(250, 193, 128, 0.2) 100%' }}></div>
						}
						
						<div className="flex flex-col sm:flex-row justify-between flex-wrap z-20 gap-4 items-start sm:items-center">
							<div className="rounded-lg sm:h-64 w-64 flex flex-col justify-between gap-6 relative text-xl "> {/* before:content-['1.'] before:absolute before:-top-5 before:-left-5 before:font-extrabold before:bg-gradient-to-tr before:text-transparent before:text-sm before:flex before:items-center before:justify-center before:rounded-md before:text-slate-100 before:h-5 before:w-5 */}
								<div>
									<h2 className="text-xl relative after:content-['SUPPORTER'] after:text-sm after:top-0 after:absolute after:font-semibold after:text-orange-300 after:bg-gradient-to-tr after:text-transparent after:bg-clip-text dark:text-white">Reseda</h2>
									<h1 className="text-4xl font-semibold dark:text-white">$0.00 <i className="text-base not-italic text-transparent bg-gradient-to-tr bg-clip-text">/month</i></h1>

									<p className="text-sm text-slate-400">Tier dissolved upon release, holders gain 25% global discount</p>
								</div>

								<div className="flex flex-col flex-1">	
									<div className="flex flex-row gap-2 items-center">
										<div className="h-4 w-4 rounded-full bg-gradient-to-tr flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">50GB Free</div>
									</div>
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-gradient-to-tr flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">Up to <strong className="bg-gradient-to-tr text-transparent bg-clip-text rounded-sm py-0 px-1" >1GB/s</strong> Transfer</div>
									</div>
									<div className="flex flex-row gap-2 items-center ">
										<div className="h-4 w-4 rounded-full bg-gradient-to-tr flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                        <div className="text-base text-slate-700 dark:text-slate-300">Unlimited Devices <i className="not-italic text-sm text-slate-400">(concurrent)</i> </div>
									</div>
								</div>
							</div>

							<div className="flex flex-col flex-1 max-w-xl text-justify gap-4">
								<p className="text-slate-600 dark:text-white">Joining in pre-release gives you access to the reseda <strong className="bg-gradient-to-tr text-transparent bg-clip-text rounded-sm py-0 px-1" >supporter</strong> tier. Whilst in development, as a supporter - you can reap 50GB free data, and an uncapped data transfer rate. Supporting as many devices as you want at the same time. All for the low cost of $0.00. <br /> <i className="text-slate-400 not-italic text-sm">*Requires Waitlist Acceptance (Multiple account abuse not permitted)</i></p>

								{/* <Button className="h-10 w-fit border-2 border-gray-300 text-base px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer bg-gray-200/60 text-gray-900 hover:bg-gray-200 hover:text-gray-900" onClick={() => {
									document.getElementById("waitlistInput").focus();
								}}>
									Get Reseda
								</Button> */}
							</div>
						</div>
					</div>
				</div>

                <div className="pt-16 pb-16 dark:bg-[#05010d]"></div>
				
				<Footer />
			</div>
		</div>
		:
		<></>
}
