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
                        <h1 className="font-bold text-3xl">Our Commitment to Open Source  </h1>
                        <br />
                        <p className="text-justify">
                            Reseda is committed to open source software, as such - our client is completely open source for any that wish to take a look, tinker with it or edit it. Reseda tracks usage server-side, checking only the data transferred. In no way are permanent logs taken of network traffic or IP* by reseda.
                            <br /><br />
                        </p>

                        <div className="flex flex-row items-center gap-2">
                            <GitHub size={16}/> 
                            <p>
                                You can find the reseda client source code <a className="text-violet-500" href="https://github.com/bennjii/reseda">here</a>.
                            </p>
                        </div>

                        <p>
                            <br />
                            <i className="text-sm not-italic">
                            *It is worth noting, by using the wireguard protocol, IP{'\''}s are stored in a cache for connection optimization. 
                            This is outside the control of reseda, and we are working on a local network protocol to remove this cache. However, this cache is not publicly accessible nor permanently stored in any way.
                            </i>
                        </p>
                    </div>
                </div>

				<div className="pt-16 pb-16"></div>
				
				<Footer />
			</div>
		</div>
	)
}
