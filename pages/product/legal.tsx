import styles from '@styles/Home.module.css'
import { useEffect, useRef, useState } from 'react';
import Header from '@components/header';
import Banner from '@components/banner';
import Button from '@components/un-ui/button';
import Input from '@components/un-ui/input';
import { Gradient } from '@components/gradient'

import Image from 'next/image';
import Footer from '@components/footer';
import { Check, GitHub } from 'react-feather';
import { motion, useAnimation, useViewportScroll, Variants } from "framer-motion"
import useMediaQuery from '@components/media_query';
import { cardVariants, subTitleControl, titleControl, titleVariants } from '@components/framer_constants';
import Waitlist from '@components/waitlist';

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

	useEffect(() => {
          // Create your instance
          const gradient = new Gradient()
  
          // Call `initGradient` with the selector to your canvas

		  //@ts-expect-error
          gradient.initGradient('#gradient-canvas')
	}, []);

	return (
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<Banner title={"💪 Improvements"} text={"Reseda is currently undergoing a major refactor"} url={"https://twitter.com/UnRealG3/status/1490596150944043012?s=20&t=DNFSbVhA3wkoWyVOkwAvxQ"} />

			<div className="flex-col flex font-sans min-h-screen w-screen relative">
				<Header />

                <div className="w-full mx-auto flex-1">
                    <div className="mx-auto max-w-screen-lg p-4 pt-12">
                        <h1 className="text-3xl font-bold">Legal</h1>
                        <br />
                        <h1 id="cookie" className="text-xl font-bold">Cookie Policy</h1>
                        <p>We keep 3 cookies under 2 different categories. All of which do <strong>not</strong> apply to any user who has not logged in. We do not keep cookies or store tracing information of any user who visits reseda.app.</p>
                        
                        <br />
                        <h3 className="font-bold">next-auth.session-token</h3>
                        <p>
                            An essential cookie to keep auth state persistance after closing the tab. Managed by NextAuth; the cookie stores identification to determine the user and prove thier identification.
                        </p>

                        <br />
                        <h3 className="font-bold">next-auth.csrf-token</h3>
                        <p>
                            A session-based cookie which maintains the users authentication state whilst using the app, this prevents the need to continually query user information, and leaves it readily accessable for the client.
                        </p>
  
                        <br />
                        <h3 className="font-bold">next-auth.callback-url</h3>
                        <p>
                            A session-based cookie which maintains the users location for NextAuth to return to if neccesary upon recieving an error, a callback URL. 
                        </p>
                        
                        <br />
                        <h1 id="tos" className="text-xl font-bold">Terms of Service</h1>
                        <p>See our TOS <a className="text-violet-500" href="../legal.html">here</a>.</p>
                        
                        <br />
                        <h1 id="privacy" className="text-xl font-bold">Privacy Policy</h1>
                        <p>See our privacy policy <a className="text-violet-500" href="../legal.html">here</a>.</p>
                        {/* <iframe className="w-full rounded-md" src="../legal.html"></iframe> */}
                    </div>
                </div>

				<div className="pt-16 pb-16"></div>

				<Footer />
			</div>
		</div>
	)
}
