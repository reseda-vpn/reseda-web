
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

	useEffect(() => {
		lancero.leads.find(email).then(e => {
			if(e.success) setExists(true);
		})
	}, [email, lancero]);
	
	return (
		<div className={styles.container}>
			<Banner title={"💰Funding"} text={"Reseda has reached 100k in crowd funding"} url={""} />
			<Header />

			<div className={styles.landingTop}>
				<div>
					<div className={styles.titleContainer}>
						<h1>Fast and Affordable</h1>
						<p>A VPN that charges you what you use, never wonder if you are paying too much.</p>
					</div>
					
					<div className={styles.waitlistContainer}>
						{
							exists ?
							<></>
							:
							<div>
								<input placeholder="Email" type="email" onChange={(e) => {
									setEmail(e.target.value);
								}}/>
								<button onClick={() => {
									lancero.leads.create({
										email
									})
								}}>Join the Waitlist</button>
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
			</div>
		</div>
	)
}
