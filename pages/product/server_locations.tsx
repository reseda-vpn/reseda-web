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
    const [ serverRegistry, setServerRegistry ] = useState([]);
    const [ fetching, setFetching ] = useState<boolean>(true);

	useEffect(() => {
        const gradient = new Gradient()

        //@ts-expect-error
        gradient.initGradient('#gradient-canvas')

            fetch('https://reseda.app/api/server/list', {
                method: "GET",
                redirect: 'follow'
            })
                .then(async e => {
                    const json = await e.json();
                    setServerRegistry(json);
                    setFetching(false);
                })
                .catch(e => {
                    console.log(e)
                })
	}, []);

	return (
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<Banner title={"💪 Improvements"} text={"Reseda is currently undergoing a major refactor"} url={"https://twitter.com/UnRealG3/status/1490596150944043012?s=20&t=DNFSbVhA3wkoWyVOkwAvxQ"} />

			<div className="flex-col flex font-sans min-h-screen w-screen relative">
				<Header />
                
                <div className="w-full mx-auto flex-1">
                    <div className="mx-auto max-w-screen-lg p-4 pt-12">
                        <h1 className="font-bold text-3xl">Server Locations</h1>
                        
                        {
                            serverRegistry?.map(e => {
                                <div 
                                    key={e.id}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: ".6rem" }}>
                                            <span style={{ height: '22px' }} className={`twa twa-${e.flag}`}></span>
                                            <p>{ e.country }</p>
                                        </div>
                                        
                                        <p className={styles.mono}>{e.hostname}</p>
                                        {
                                                <div className={styles.mono}>
                                                </div>
                                        }
                                </div>
                                })
                        }
                        
                    </div>
                </div>

				<div className="pt-16 pb-16"></div>
				
				<Footer />
			</div>
		</div>
	)
}
