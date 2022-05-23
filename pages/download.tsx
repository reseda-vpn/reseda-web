import { useEffect, useState } from 'react';
import Header from '@components/header';
import Banner from '@components/banner';
import Button from '@components/un-ui/button';

import Footer from '@components/footer';
import { Check} from 'react-feather';
import { FaApple, FaExclamation, FaLinux, FaWindows } from "react-icons/fa"

export async function getStaticProps() {
	const metaTags = {
		"og:title": [`Download Reseda`],
		"og:description": ["Reseda VPN is available for windows."],
		"og:url": [`https://reseda.app/download`],
	};
    const releases = JSON.stringify(
        await fetch("https://api.github.com/repos/bennjii/reseda/releases").then(e => {
            return e.json();
        })
    );

	return {
	  props: {
		metaTags,
        releases
	  },
      revalidate: 60 * 5
	}
}

export default function Home({ releases }) {
    const [ releaseFeatures, setReleaseFeatures ] = useState({
        windows: null,
        mac_os: null,
        linux: null,
        pre_release: false,
        version: null
    })

    const [ releasesCache, setReleasesCache ] = useState(null);
    const [ type, setType ] = useState<"windows" | "mac_os" | "linux">("windows");
    const [ downloaded, setDownloaded ] = useState(false);
    const [ changeVersion, setChangeVersion ] = useState(false);
    const [ version, setVersion ] = useState(null);
    const [ ft, setFt ] = useState(true);

	useEffect(() => {
        if(navigator.userAgent.match(/Linux/i)) {
            setType("linux")
        }else if(navigator.userAgent.match(/Windows/i)) {
            setType("windows")
        }else if(navigator.userAgent.match(/Mac/i)) {
            setType("mac_os")
        }

        const releases_: any[] = JSON.parse(releases);
        
        releases_.sort((a, b) => {
            return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        });

        releases_.filter(a => {
            return !a.draft
        });

        setReleasesCache(releases_);

        const this_release = !version ? releases_[0] : releases_.find(e => e?.tag_name == version);
        const new_releaseFeatures = {
            windows: null,
            mac_os: null,
            linux: null,
            pre_release: false,
            download_url: null,
            version: null
        }

        console.log(this_release, version);

        this_release?.assets?.map((e: { name: string, browser_download_url: string }) => {
            if(e.name.endsWith("_x64_en-US.msi")) {
                new_releaseFeatures.windows = e?.browser_download_url;
            }

            if(e.name.endsWith(".deb") || e.name.endsWith(".tar.gz")) {
                new_releaseFeatures.linux = e?.browser_download_url;
            }

            if(e.name.endsWith("_x64.dmg")) {
                new_releaseFeatures.mac_os = e?.browser_download_url;
            }
        });

        if(this_release?.prerelease) new_releaseFeatures.pre_release = true;
        new_releaseFeatures.version = this_release?.tag_name;

        setReleaseFeatures(new_releaseFeatures);
        if(ft) setVersion(releases_?.[0]?.tag_name);
        setFt(false);
	}, [releases, version]);

	return (
		<div className="flex-col flex font-sans min-h-screen" > {/* style={{ background: 'linear-gradient(-45deg, rgba(99,85,164,0.2) 0%, rgba(232,154,62,.2) 100%)' }} */}
			<Banner title={"💪 Improvements"} text={"Reseda is currently undergoing a major refactor"} url={"https://twitter.com/UnRealG3/status/1490596150944043012?s=20&t=DNFSbVhA3wkoWyVOkwAvxQ"} />

            {
                changeVersion ?
                    <div 
                        className="fixed top-0 left-0 flex flex-1 h-screen w-screen z-50 bg-slate-500 bg-opacity-40 items-center content-center justify-center"
                        onClick={() => { 
                            setChangeVersion(false);
                        }}
                        >
                        <div 
                            className="text-base font-normal bg-white rounded-md px-2 cursor-pointer" 
                        >
                            <div 
                                className="p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-col pb-2 gap-4">
                                    <p className="flex flex-col font-altSans font-semibold text-xl">Choose from the <br /> following available versions</p> 
                                    <div className="rounded-md bg-white gap-2 flex flex-col">
                                        {
                                            releasesCache.map(e => {
                                                return (
                                                    <div 
                                                        className={`cursor-pointer rounded-md px-2 font-semibold flex flex-row gap-2 items-center justify-between ${e.tag_name == version ? "border-2 border-purple-500 bg-purple-50" : "border-2 border-transparent"}`}
                                                        key={e?.tag_name}
                                                        onClick={() => {
                                                            if(e?.tag_name) setVersion(e.tag_name)

                                                            setChangeVersion(false);
                                                        }}
                                                    >
                                                        <p className="font-bold text-lg">{ e?.tag_name?.split("app-")?.[1] }</p>
                                                        <p className="text-sm">{ e?.prerelease ? "pre-release" : "" }</p>
                                                    </div>
                                                )
                                            })
                                        }
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

				<div className="pt-8 pb-16"></div>
                
                {
                    downloaded ?
                    <div className="flex flex-col gap-2 md:max-w-screen-lg w-full my-0 mx-auto py-2 px-4 max-w-sm relative h-full flex-1" id="vpn">
                        <h1 className="flex text-[2.5rem] font-bold text-slate-800 mb-0 pb-0 font-altSans">Thank You!</h1>

                        <div className="flex flex-row items-center gap-2 font-altSans">
                            Thanks for downloading reseda, and supporting what we do! 
                        </div>
                        <div className="pt-2 pb-2"></div>

                        <div className="flex flex-row font-altSans font-semibold text-lg text-slate-700">
                            Your download will begin shortly...
                        </div>

                        <div className="flex flex-col gap-0">
                            <p className="flex flex-row text-slate-500 gap-1">Download hasn{'\''}t started? Click <a className="text-blue-500" href={releaseFeatures[type]}>here</a> to try again.</p>
                            <p className="flex flex-row text-slate-500 gap-1">Installed the wrong version? Click <a className="text-blue-500" onClick={() => {setDownloaded(false)}}>here</a> to go back.</p>
                        </div>
                       
                        <br />

                        Follow these steps and get connected in no time.
                        <div>
                            <div className="grid grid-cols-[25px_1fr]">
                                <div className="flex flex-col">
                                    1.
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-slate-800 font-bold font-altSans text-lg">Install</p>
                                    <tr className="text-slate-600">Click the installer and follow the instructions.</tr>
                                </div>
                            </div>
                            <div className="grid grid-cols-[25px_1fr]">
                                <div className="flex flex-col">
                                    2. 
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-slate-800 font-bold font-altSans text-lg">Get Connected</p>
                                    <tr className="text-slate-600">Open Reseda and let it perform the initial setup, then you can sign in with your account and you{'\''}re good to go! If you don{'\''}t have an account already, click <a className="text-blue-500" href="https://reseda.app/signup">here</a> to get one!</tr>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="flex flex-col gap-2 md:max-w-screen-lg w-full my-0 mx-auto py-2 px-4 max-w-sm relative h-full flex-1" id="vpn">
                        <h1 className="flex text-[2.5rem] font-bold text-slate-800 mb-0 pb-0 font-altSans">Download Reseda 
                            {
                                releasesCache?.[0]?.tag_name == version ? 
                                    <p className="text-base justify-end items-end self-end font-normal bg-slate-200 rounded-md px-2 cursor-pointer" onClick={() => setChangeVersion(true) }>
                                        { releaseFeatures?.version?.split("app-")?.[1] }
                                    </p>
                                    : 
                                    <p className="text-base flex flex-row items-center justify-end gap-1 self-end font-normal bg-orange-200 rounded-md px-2 cursor-pointer" onClick={() => setChangeVersion(true) }>
                                        { releaseFeatures?.version?.split("app-")?.[1] }
                                        <b>!</b>
                                    </p>
                            }
                        </h1>

                        <div className="flex flex-row items-center gap-2 font-altSans">
                            Compatible with 
                            {
                                releaseFeatures.windows ? <div className="flex flex-row items-center gap-2 bg-blue-100 rounded-md px-2 py-1 text-blue-800 font-semibold">
                                    <FaWindows />
                                    <p>Windows</p>

                                    <p className="font-light">7, 8, 10, 11</p>
                                </div> : <></>
                            }

                            {
                                releaseFeatures.linux ? <div className="flex flex-row items-center gap-2 bg-purple-100 rounded-md px-2 py-1 text-purple-800 font-semibold">
                                    <FaLinux />
                                    <p>Linux</p>
                                </div> : <></>
                            }

                            {
                                releaseFeatures.mac_os ? <div className="flex flex-row items-center gap-2 bg-orange-100 rounded-md px-2 py-1 text-orange-800 font-semibold">
                                    <FaApple />
                                    <p>MacOS</p>

                                    <p className="font-light">Sierra+</p>
                                </div> : <></>
                            }
                        </div>

                        <div>
                            <div className="flex flex-row items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                <p><strong className="text-violet-500 rounded-sm py-0 px-1" >1GB/s</strong> Speeds to keep up with whatever you do.</p>
                            </div>

                            <div className="flex flex-row items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                <p>Connect in <strong className="text-violet-500 rounded-sm py-0 px-1" >under 2s</strong> with reseda-server technology</p>
                            </div>

                            <div className="flex flex-row items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                <p>Your traffic is <strong className="text-violet-500 rounded-sm py-0 px-1" >encrypted</strong> end-to-end</p>
                            </div>

                            <div className="flex flex-row items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                <p>Keep your location <strong className="text-violet-500 rounded-sm py-0 px-1" >private</strong>, with no DNS leaks.</p>
                            </div>

                            <div className="flex flex-row items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                <p>Stable, Component Based Backend Architecture to keep your connections <strong className="text-violet-500 rounded-sm py-0 px-1" >stable</strong></p>
                            </div>
                        </div>

                        <div className="pt-6 pb-6"></div>
                        
                        <p>Choose Version</p>
                        <div className="flex flex-row items-center gap-2 font-altSans">
                            {
                                releaseFeatures.windows ? <div onClick={() => setType("windows")} className={`cursor-pointer select-none flex flex-row items-center gap-2 rounded-md px-2 py-1 font-semibold ${type == "windows" ? "border-2 border-purple-500 bg-purple-50" : "border-2 border-transparent"}`}>
                                    <FaWindows />
                                    <p>Windows</p>
                                </div> : <></>
                            }

                            {
                                releaseFeatures.linux ? <div onClick={() => setType("linux")} className={`cursor-pointer select-none flex flex-row items-center gap-2 rounded-md px-2 py-1 font-semibold ${type == "linux" ? "border-2 border-purple-500 bg-purple-50" : "border-2 border-transparent"}`}>
                                    <FaLinux />
                                    <p>Linux</p>
                                </div> : <></>
                            }

                            {
                                releaseFeatures.mac_os ? <div onClick={() => setType("mac_os")} className={`cursor-pointer select-none flex flex-row items-center gap-2 rounded-md px-2 py-1 font-semibold ${type == "mac_os" ? "border-2 border-purple-500 bg-purple-50" : "border-2 border-transparent"}`}>
                                    <FaApple />
                                    <p>MacOS</p>
                                </div> : <></>
                            }
                        </div>
                        {
                            releaseFeatures[type] ? <></> : <p className="text-sm font-altSans text-slate-400">We{'\''}ve detected that you are using an OS that this version does not support</p>
                        }

                        <div className="pt-6 pb-6"></div>

                        
                        {
                            releasesCache?.[0]?.tag_name == version ? 
                                <></> 
                            : 
                                <div className="text-sm font-altSans flex flex-row items-center gap-2 bg-orange-100 w-fit px-2 rounded-md pl-0">
                                    <p className="flex flex-row items-center gap-1 bg-orange-200 rounded-md px-2 w-fit cursor-pointer" onClick={() => setChangeVersion(true) }>
                                        <b>!</b>
                                    </p>
                                    <p>This is not the current version</p>
                                </div>
                        }
                        
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row items-center gap-2">
                                {
                                    releaseFeatures[type] ?
                                    <>
                                        <Button icon={false} href={releaseFeatures?.[type]} onClick={() => {
                                            setDownloaded(true);
                                        }} className="bg-violet-600 text-slate-50 font-semibold text-[1.1rem] px-5 py-4 h-10 w-40 rounded-2xl font-altSans" >Download app</Button> <p className="text-sm text-slate-400">for {type == "windows" ? "Windows" : type == "linux" ? "Linux" : "MacOS"}</p>
                                    </>
                                    :
                                    <>
                                        <Button icon={false} style={{ width: '180px' }} className="bg-violet-300 text-slate-50 font-semibold text-[1rem] px-5 py-4 h-10 w-40 rounded-2xl font-altSans" >Download app</Button> <p className="text-sm text-slate-400">for {type == "windows" ? "Windows" : type == "linux" ? "Linux" : "MacOS"}</p> 
                                    </>
                                }
                            </div>
                            
                            <p className="text-black flex flex-row items-center text-sm">Don{'\''}t have Reseda? <Button icon={false} href="/signup" className="text-blue-500 text-sm pl-1" >Get Access</Button></p>
                        </div>
                    </div>
                }
                

				<div className="pt-16 pb-16"></div>
				
				<Footer />
			</div>
		</div>
	)
}
