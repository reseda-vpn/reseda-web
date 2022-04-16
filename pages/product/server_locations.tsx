import styles from '@styles/Home.module.css'
import { useEffect, useRef, useState } from 'react';
import Header from '@components/header';
import Banner from '@components/banner';
import Button from '@components/un-ui/button';
import Input from '@components/un-ui/input';
import { Gradient } from '@components/gradient'

import Image from 'next/image';
import Footer from '@components/footer';
import { ArrowDown, Check, ChevronDown, GitHub } from 'react-feather';
import { motion, useAnimation, useViewportScroll, Variants } from "framer-motion"
import useMediaQuery from '@components/media_query';
import { cardVariants, subTitleControl, titleControl, titleVariants } from '@components/framer_constants';
import Waitlist from '@components/waitlist';
import moment from 'moment';
import Loader from '@components/un-ui/loader';

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
    const [ reqServer, setReqServer ] = useState(null);

	useEffect(() => {
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

    useEffect(() => {
        if(reqServer?.hostname)
            fetch(`https://reseda.app/api/server/ping`, {
                method: "POST",
                body: JSON.stringify({
                    location: reqServer.hostname
                })
            })
                .then(async e => {
                    const json = await e.json();
                    console.log(json);
                })
                .catch(e => {
                    console.log(e)
                })
	}, [reqServer]);

	return (
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<Banner title={"💪 Improvements"} text={"Reseda is currently undergoing a major refactor"} url={"https://twitter.com/UnRealG3/status/1490596150944043012?s=20&t=DNFSbVhA3wkoWyVOkwAvxQ"} />

            {
                reqServer ?
                    <div 
                        className="fixed top-0 left-0 flex flex-1 h-screen w-screen z-50 bg-slate-400 bg-opacity-40 items-center content-center justify-center"
                        onClick={() => setReqServer(null)}
                        >
                        <div 
                            className="p-6 bg-slate-800 text-white rounded-lg"
                            onClick={(e) => e.preventDefault()}
                        >
                            <div className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <div className="flex items-center gap-2 flex-row-reverse">
                                        <span className={`twa twa-${reqServer.flag}`}></span>
                                        <h2 className="font-bold text-xl">{reqServer.country}</h2>
                                    </div>

                                    <p className="text-sm text-slate-400">{reqServer.id}</p>
                                </div>

                                <div>
                                </div>
                            </div>
                            
                            {/* <hr /> */}

                            <div className="grid grid-cols-3 pt-4 gap-3 gap-x-8">
                                <div>
                                    <p className="text-sm opacity-50">Status</p>
                                    <div className="flex flex-row items-center gap-2">
                                        <div className="h-2 w-2 bg-green-300 rounded-full"></div>
                                        <p>Online</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm opacity-50">Uptime</p>
                                    <div className="flex flex-row items-center gap-2">
                                        <div className="h-2 w-2 bg-green-300 rounded-full"></div>
                                        <p>{ moment.duration(new Date().getTime() - new Date(reqServer.serverUp).getTime()).humanize() }</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-sm opacity-50">Location</p>
                                    <div className="flex flex-row items-center gap-2">
                                        {reqServer.location}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm opacity-50">Server Type</p>
                                    <div className="flex flex-row items-center gap-2">
                                        Physical
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm opacity-50">Internet Protocol</p>
                                    <div className="flex flex-row items-center gap-2">
                                        {reqServer.hostname}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                :
                    <></>
            }

			<div className="flex-col flex font-sans min-h-screen w-screen relative">
				<Header />
                
                <div className="w-full mx-auto flex-1">
                    <div className="mx-auto max-w-screen-lg p-4 pt-12">
                        <h1 className="font-bold text-3xl">Server Locations</h1>

                        <br />

                        <div className='flex flex-wrap flex-row gap-4'>
                            {
                                serverRegistry ? 
                                    serverRegistry?.map(e => {
                                        return (
                                            <div 
                                                key={e.id} 
                                                className="font-altSans flex flex-row items-center gap-2 bg-violet-50 px-4 py-2 rounded-md hover:cursor-pointer"
                                                onClick={() => setReqServer(e)}
                                                >
                                                <p>{ e.country }</p>

                                                <ChevronDown strokeWidth={1}></ChevronDown>
                                            </div> 
                                        );
                                    })
                                :
                                <div className="flex justify-center items-center w-full">
                                    <Loader color={"#000"} height={25}></Loader>

                                </div>
                                
                            }
                        </div>
                        <br />
                        and many more to come...
                    </div>
                </div>

				<div className="pt-16 pb-16"></div>
				
				<Footer />
			</div>
		</div>
	)
}
