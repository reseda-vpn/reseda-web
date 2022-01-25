
import styles from '../styles/Home.module.css'

import Lancero from '@lancero/node';
import { useEffect, useState } from 'react';
import Header from '@components/header';
import Banner from '@components/banner';
import Button from '@components/un-ui/button';
import Input from '@components/un-ui/input';

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
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<Banner title={"💰Funding"} text={"Reseda has reached 100k in crowd funding"} url={""} />
			<Header />

			<div className="flex flex-row justify-center items-center flex-1 h-full gap-64">
				<div className="h-fit flex flex-col gap-8 items-start">
					<div>
						<h1 className="text-6xl font-extrabold m-0 relative text-slate-800 text-left">Fast and Affordable</h1>
						<p className="text-slate-400 text-left" >A VPN that charges you for what you use, never worry about paying too much.</p>
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
									callback={(email, rerun) => {
										lancero.leads.create({
											email
										}).then(() => rerun());
									}}>	
								</Input>
							</div>
						}
					</div>
				</div>

				<div className={styles.resedaFancyConnection}>
					<div>
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
