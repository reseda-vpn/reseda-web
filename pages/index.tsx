
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Lancero from '@lancero/node';
import { useEffect, useState } from 'react';
import Header from '@components/header';
import Banner from '@components/banner';
import Image from 'next/image';

export default function Home() {
	const [ lancero, setLancero ] = useState(new Lancero("pk_0aab4b0d8e8e344baffc30b560184bbc20dcca2bc943b15e"))
	const [ email, setEmail ] = useState("");
	const [ exists, setExists ] = useState(false);

	// useEffect(() => {
	// 	lancero.leads.find(email).then(e => {
	// 		if(e.success) setExists(true);
	// 	})
	// }, [email, lancero]);
	
	return (
		<div className="flex-col flex font-sans min-h-screen" style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }}>
			{/* <Banner title={"💰Funding"} text={"Reseda has reached 100k in crowd funding"} url={""} /> */}
			<Header />

			<div className="flex flex-row justify-center items-center flex-1 h-full gap-64">
				<div className="h-fit flex flex-col gap-8">
					<div>
						<h1 className="text-6xl font-extrabold m-0 relative text-slate-800 text-center">Fast and Affordable</h1>
						<p className="text-slate-400 text-center" >A VPN that charges you what you use, never wonder if you are paying too much.</p>
					</div>
					
					<div className={styles.waitlistContainer}>
						{
							exists ?
							<></>
							:
							<div className="flex flex-row align-center justify-center">
								<input 
									className="h-12 border-2 border-solid border-slate-800 bg-white py-2 px-4 w-72 outline-none"
									placeholder="Email" 
									type="email" 
									onChange={(e) => {
										setEmail(e.target.value);
									}}
								/>
								<button 
									className="h-12 border-2 border-solid border-slate-800 text-slate-800 py-2 px-4 m-0 bg-slate-800 text-white"
									onClick={() => {
										lancero.leads.create({
											email
										})
									}}>
									Join the Waitlist
								</button>
							</div>
						}
					</div>
				</div>

				<div className={styles.resedaFancyConnection}>
					<div	>
						<span className={styles.connectedToServerOuter}>
							<span className={styles.connectedToServerInner}>
								<span style={{ backgroundSize: '400%', animationDuration: '10s' }} >
									R
								</span>
							</span>
						</span>
					</div>
					
				</div>

				<div className='gap-4'></div>
			</div>
		</div>
	)
}
