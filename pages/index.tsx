import styles from '@styles/Home.module.css'
import { useEffect, useState } from 'react';
import Header from '@components/header';
import Banner from '@components/banner';
import Button from '@components/un-ui/button';
import Input from '@components/un-ui/input';
import { Gradient } from '@components/gradient'

import { IoSpeedometer } from 'react-icons/io5'
import Image from 'next/image';
import Footer from '@components/footer';
import { Check } from 'react-feather';

export default function Home() {
	const [ email, setEmail ] = useState("");
	const [ exists, setExists ] = useState(false);

	// useEffect(() => {
	// 	lancero.leads.find(email).then(e => {
	// 		if(e.success) setExists(true);
	// 	})
	// }, [email, lancero]);

	useEffect(() => {
          // Create your instance
          const gradient = new Gradient()
  
          // Call `initGradient` with the selector to your canvas

		  //@ts-expect-error
          gradient.initGradient('#gradient-canvas')
	}, [])
	
	return (
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<Banner title={"💪 Support"} text={"Reseda is releasing support for MacOS and Linux"} url={""} />

			<div className="flex-col flex font-sans min-h-screen w-screen relative gap-52">
				<Header />

				<canvas id="gradient-canvas" className="-top-24 md:top-0" data-transition-in>
				</canvas>

				<div className="flex flex-row items-center h-fill md:pt-36 max-w-screen-lg w-full my-0 mx-auto px-4">
					<div className="h-fit flex flex-col gap-8 items-start">
						<div className="z-50 relative">
							<h1 className="text-6xl md:text-8xl font-bold m-0 text-slate-800 text-left z-50">Fast & <br /> Affordable</h1> {/* absolute top-0 left-0 mix-blend-color-burn */}
							<p className="text-slate-400 text-left z-50" >A VPN that charges you for what you use, never worry about paying too much.</p>
						</div>
						
						<div className="flex flex-col gap-2">
							<h2 className="uppercase text-sm text-slate-400 font-semibold">Join the waitlist</h2>
							{
								exists ?
								<></>
								:
								<div className="flex flex-row align-center justify-center">
									<Input  
										placeholder='Email'
										callback={(email, ui_callback) => {
											fetch('/api/create_lead', {
												body: email,
												method: 'POST'
											})
												.then(async (e) => { const j = await e.json(); ui_callback(j) })
												.catch(async (e) => { const j = await e.json(); ui_callback(j) });
										}}>	
									</Input>
								</div>
							}
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

				<div className="flex flex-col md:gap-16 gap-8 md:max-w-screen-lg w-full my-0 mx-auto py-2 px-4 max-w-sm "> {/* border-l-2 border-violet-500 sm:border-0 */}
					<div className="flex flex-col">
						<h2 className="text-violet-500">VPN</h2>
						<h1 className="m-0 font-bold text-2xl md:text-3xl">Reseda is Blazing Fast, and Incredibly Secure</h1>
						<p className="text-slate-600 text-base">Reseda is fast, easy to use and private. </p>
					</div>
					
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 items-center justify-center">
						<div className="flex flex-col items-start max-w-xs gap-2 md:h-40">
							<Image src={"/assets/duotone/rocket_purple.svg"} alt={"1GB/s Speeds"} height={45} width={45} className={styles.dtsvg}/>
							<h1 className="font-semibold text-slate-800 before:h-full before:bg-violet-500 before:absolute relative before:-left-2 md:before:bg-white">Blazing 1GB/s Speeds</h1>
							<p className="text-sm text-slate-700 text-left">With real world speeds up to <strong className="bg-violet-100 text-violet-500 rounded-sm py-0 px-1" >1GB/s</strong>, Reseda can handle any task from gaming to streaming</p>
						</div>

						<div className="flex flex-col items-start max-w-xs gap-2 md:h-40">
							<Image src={"/assets/duotone/time_purple.svg"} alt={"<2s Connection"} height={45} width={45} className={styles.dtsvg}/>
							<h1 className="font-semibold text-slate-800 before:h-full before:bg-violet-500 before:absolute relative before:-left-2 md:before:bg-white">Incredibly low wait times</h1>
							<p className="text-sm text-slate-900">Connect to in under <strong className="bg-violet-100 text-violet-500 rounded-sm py-0 px-1" >2s</strong> thanks to the WireGuard&#8482; protocol.</p>
						</div>
						
						<div className="flex flex-col items-start max-w-xs gap-2 md:h-40">
							<Image src={"/assets/duotone/no_location_purple.svg"} alt={"<2s Connection"} quality={100}  height={45} width={45} className={styles.dtsvg}/>
							<h1 className="font-semibold text-slate-800 before:h-full before:bg-violet-500 before:absolute relative before:-left-2 md:before:bg-white">Keep your location private</h1>
							<p className="text-sm text-slate-900 text-left">Reseda is secure, keeping your location <strong className="bg-violet-100 text-violet-500 rounded-sm py-0 px-1" >hidden</strong>. </p>
						</div>

						<div className="flex flex-col items-start max-w-xs gap-2 md:h-40">
							<Image src={"/assets/duotone/component_purple.svg"} alt={"<2s Connection"} height={45} width={45} className={styles.dtsvg}/>
							<h1 className="font-semibold text-slate-800 before:h-full before:bg-violet-500 before:absolute relative before:-left-2 md:before:bg-white">Component-Based Backend</h1>
							<p className="text-sm text-slate-900 text-left">Reseda implements safeguards to ensure your connection remains open whilst the server is up.</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-16 max-w-screen-lg w-full my-0 mx-auto py-2 px-4">
					<div className="flex flex-col items-end">
						<h2 className="text-orange-500">PRICING</h2>
						<h1 className="m-0 font-bold text-2xl md:text-3xl text-right">Transparent, Affordable Pricing</h1>
						<p className="text-slate-600 text-base text-right">Pay as you go plans so you know what you{'\''}re paying, before you pay.</p>
					</div>
					
					<div className="flex flex-row justify-around flex-wrap">
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
									<div className="text-base text-slate-700"><strong className="bg-violet-100 text-orange-300 rounded-sm py-0 px-1" >50MB/s</strong> Transfer</div>
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
									<div className="text-base text-slate-700"><strong className="bg-violet-100 text-orange-400 rounded-sm py-0 px-1" >500MB/s</strong> Max Transfer</div>
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
									<div className="text-base text-slate-700">Up to <strong className="bg-violet-100 text-orange-500 rounded-sm py-0 px-1" >1GB/s</strong> Transfer</div>
								</div>
								<div className="flex flex-row gap-2 items-center ">
									<div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
									<div className="text-base text-slate-700">Unlimited Devices <i className="not-italic text-sm text-slate-400">(concurrent)</i> </div>
								</div>
							</div>
						</div>				
					</div>
				</div>

				<Footer />
			</div>
			
		</div>
	)
}
