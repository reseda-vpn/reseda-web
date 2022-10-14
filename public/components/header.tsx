import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useMediaQuery from './media_query';
import Button from './un-ui/button';

export const Header = () => {
	const small = useMediaQuery(640);
    const router = useRouter();

    const [ prof, setProf ] = useState(false);
    const [ indx, setIndex ] = useState(false);
	const session = useSession();

    useEffect(() => {
        console.log(session.status == "authenticated")
    }, [session]);

    useEffect(() => {
        if(window.location.href.includes("profile")) setProf(true);
        if(window.location.href == window.location.origin+"/") setIndex(true);
    }, []);

    return (
        <div className="flex flex-row z-40 sm:bg-white bg-opacity-80 sm:backdrop-blur-md">
            <div className="flex flex-row py-2 px-4 justify-between max-w-screen-lg w-full my-0 mx-auto z-40">
                <div className="flex flex-row items-center gap-4">
                    <div className={`font-bold font-altSans text-lg  ${prof || (small && !indx) ? "text-slate-800" : "text-slate-100" } sm:text-slate-800 hover:cursor-pointer`} onClick={() => router.push('../')}>RESEDA</div>   

                    <div className="flex flex-row items-center gap-4">
                        <Button icon={false} className="hidden font-normal text-sm text-slate-600 sm:flex hover:text-slate-800" onClick={() => window.location.href = ""} >VPN</Button>
                        <Button icon={false} href={"./billing/plan"} className="hidden font-normal text-sm text-slate-600 sm:flex hover:text-slate-800">Pricing</Button>
                        <Button icon={false} className="hidden font-normal text-sm text-slate-600 sm:flex hover:text-slate-800">Why Reseda?</Button>
                    </div> 
                </div>

                <div className="flex flex-row items-center gap-4">
                    {
                        router.asPath == "/profile" ? 
                        <>
                        </>
                        :
                        <>
                            {
                                session.status !== "authenticated" ? 
                                <>
                                    <Button icon={false} onClick={() => router.push('../../login')} className="text-slate-100 sm:text-slate-600 text-sm">Login</Button>
                                    <Button icon={false} onClick={() => document.getElementById("waitlistInput").focus()} className="bg-violet-600 text-slate-50 w-fit font-semibold text-sm" >Get Reseda</Button>
                                </>
                                :
                                <>
                                    <Button onClick={() => router.push('./profile')} className="bg-violet-600 text-slate-50 w-fit font-semibold text-sm" >Profile</Button>
                                </>
                            }
                            {/* style={{ background: "linear-gradient(-45deg, rgba(99,85,164,0.6) 0%, rgba(232,154,62,.6) 100%)", color: 'rgb(255,255,255)', fontWeight: '600', display: small ? "none" : "flex" }} */}
                        </>
                    }
                </div>
            </div>
        </div>
        
    )
}

export default Header;