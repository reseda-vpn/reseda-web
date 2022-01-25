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
			<Header />

			<canvas id="gradient-canvas" data-transition-in>
        	</canvas>

			<div className="flex flex-row items-center h-fill pt-72 pb-40 max-w-screen-lg w-full my-0 mx-auto px-4">
				<div className="h-fit flex flex-col gap-8 items-start">
					<div>
						<h1 className="text-8xl font-bold m-0 relative text-slate-800 text-left z-50">Fast & <br /> Affordable</h1>
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
										}).then(() => ui_callback());
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

			<div className="flex flex-col gap-8 max-w-screen-lg w-full my-0 mx-auto py-2 px-4">
				<div className="flex flex-col">
					<h2 className="text-violet-500">VPN</h2>
					<h1 className="m-0 text-semibold text-2xl">Reseda is Blazing Fast, and Incredibly Secure</h1>
				</div>
				
				<div className="grid grid-cols-4 gap-8">
					<div>
						<Image src={"/assets/duotone/rocket_purple.svg"} alt={"1GB/s Speeds"} height={45} width={45} className={styles.dtsvg}/>
						<h1 className="font-semibold text-slate-600">Blazing 1GB/s Speeds</h1>
						<p className="text-sm text-slate-900 text-justify">With real world speeds up to <strong className="bg-violet-100 text-violet-500 rounded-sm py-0 px-1" >1GB/s</strong>, Reseda can handle any task from gaming to streaming</p>
					</div>

					<div>
						<Image src={"/assets/duotone/time_purple.svg"} alt={"<2s Connection"} height={45} width={45} className={styles.dtsvg}/>
						<h1 className="font-semibold text-slate-600">Incredibly Low wait times</h1>
						<p className="text-sm text-slate-900">Connect to in under <strong className="bg-violet-100 text-violet-500 rounded-sm py-0 px-1" >2s</strong> thanks to the WireGuard&#8482; protocol.</p>
					</div>
					
					<div>
						<Image src={"/assets/duotone/no_location_purple.svg"} alt={"<2s Connection"} quality={100}  height={45} width={45} className={styles.dtsvg}/>
						<h1 className="font-semibold text-slate-600">Keep your location private</h1>
						<p className="text-sm text-slate-900 text-justify">Reseda is secure, keeping your location <strong className="bg-violet-100 text-violet-500 rounded-sm py-0 px-1" >hidden</strong>. </p>
					</div>

					<div>
						<Image src={"/assets/duotone/component_purple.svg"} alt={"<2s Connection"} height={45} width={45} className={styles.dtsvg}/>
						<h1 className="font-semibold text-slate-600">Incredibly Low wait times</h1>
						<p className="text-sm text-slate-900 text-justify">Connect to a reseda-server in under <strong className="mono" >2s</strong> thanks to the WireGuard&#8482; protocol.</p>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}
