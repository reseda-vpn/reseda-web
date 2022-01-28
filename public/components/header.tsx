import useMediaQuery from './media_query';
import Button from './un-ui/button';

export const Header = () => {
	const small = useMediaQuery(640);

    return (
        <div className="flex flex-row z-50 sm:bg-white bg-opacity-80 sm:backdrop-blur-md">
            <div className="flex flex-row py-2 px-4 justify-between max-w-screen-lg w-full my-0 mx-auto z-50">
                <div className="flex flex-row items-center gap-4">
                    <div className="font-bold font-altSans text-lg sm:text-slate-800 text-slate-100">RESEDA</div>   

                    <div className="flex flex-row items-center gap-4">
                        <Button icon={false} className="hidden font-normal text-sm text-slate-600 sm:flex hover:text-slate-800" onClick={() => window.location.href = ""} >VPN</Button>
                        <Button icon={false} className="hidden font-normal text-sm text-slate-600 sm:flex hover:text-slate-800">Pricing</Button>
                        <Button icon={false} className="hidden font-normal text-sm text-slate-600 sm:flex hover:text-slate-800">Why Reseda?</Button>
                    </div> 
                </div>

                <div className="flex flex-row items-center gap-4">
                    <Button icon={false}>Login</Button>
                    <Button icon={false} onClick={() => document.getElementById("waitlistInput").focus()} style={{ background: "linear-gradient(-45deg, rgba(99,85,164,0.6) 0%, rgba(232,154,62,.6) 100%)", color: 'rgb(255,255,255)', fontWeight: '600', display: small ? "none" : "flex" }}>Get Reseda</Button>
                </div>
            </div>
        </div>
        
    )
}

export default Header;