import Button from './un-ui/button';

export const Footer = () => {
    return (
        <div className="flex flex-col w-full h-64 bg-slate-800">
            <div className="flex flex-row justify-between z-50 bg-slate-800 bg-opacity-80 backdrop-blur-md max-w-screen-lg w-full mx-auto h-full">
                <div className="px-0 py-8 flex flex-col justify-between h-full flex-1 gap-2" >
                    <div className="font-bold font-altSans text-lg text-slate-100">RESEDA</div>   

                    <div className="flex flex-1 flex-row justify-around">
                        <div className="flex flex-col">
                            <p className="font-semibold text-base text-slate-100">Product</p>
                            <p className="font-light text-slate-100 text-sm">VPN</p>
                            <p className="font-light text-slate-100 text-sm">Pre-Release</p>
                            <p className="font-light text-slate-100 text-sm">Open-Source</p>
                        </div>

                        <div className="flex flex-col">
                            <p className="font-semibold text-base text-slate-100">Legal</p>
                            <p className="font-light text-slate-100 text-sm">Cookie Policy</p>
                            <p className="font-light text-slate-100 text-sm">Terms of Service</p>
                            <p className="font-light text-slate-100 text-sm">Privacy Policy</p>
                        </div>
                    </div>

                    <p className="text-slate-300">Made with ☕ in New Zealand</p>
                </div>
                

            </div>
        </div>
        
        
    )
}

export default Footer;