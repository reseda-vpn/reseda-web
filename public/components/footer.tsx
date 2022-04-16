import Button from './un-ui/button';
import Input from './un-ui/input';

export const Footer = () => {
    return (
        <div className="flex flex-col w-full h-64 bg-slate-800">
            <div className="flex flex-row justify-between z-40 bg-slate-800 py-2 px-4 bg-opacity-80 backdrop-blur-md max-w-screen-lg w-full mx-auto h-full">
                <div className="px-0 py-8 flex flex-col h-full flex-1 gap-2" >
                    <div className="font-bold font-altSans text-lg text-slate-100">RESEDA</div>   

                    <div className="flex flex-row justify-between items-start flex-start flex-1">
                        <div className="flex flex-1 flex-row gap-2 sm:gap-16 w-full justify-between md:justify-start">
                            <div className="flex flex-col">
                                <p className="font-semibold text-base text-slate-100">Product</p>
                                <a className="font-light text-slate-50 text-sm text-opacity-60" href="../#pricing">Pricing</a>
                                <a className="font-light text-slate-50 text-sm text-opacity-60" href="/product/open_source">Open-Source</a>
                                <a className="font-light text-slate-50 text-sm text-opacity-60" href="/product/server_locations">Server Locations</a>
                                <a className="font-light text-slate-50 text-sm text-opacity-60">Security Tools</a>

                            </div>

                            <div className="flex flex-col">
                                <p className="font-semibold text-base text-slate-100">Pre-Release</p>
                                <p className="font-light text-slate-50 text-sm text-opacity-60">Supporter Tier</p>
                                <p className="font-light text-slate-50 text-sm text-opacity-60">Security Testing</p>
                                <p className="font-light text-slate-50 text-sm text-opacity-60">Speed Analysis</p>
                            </div>

                            <div className="flex flex-col">
                                <p className="font-semibold text-base text-slate-100">Legal</p>
                                <p className="font-light text-slate-50 text-sm text-opacity-60">Cookie Policy</p>
                                <p className="font-light text-slate-50 text-sm text-opacity-60">Terms of Service</p>
                                <p className="font-light text-slate-50 text-sm text-opacity-60">Privacy Policy</p>
                            </div>
                        </div>

                        <div className="hidden md:flex flex-col">
                            <h2 className="uppercase text-sm text-slate-100 font-semibold">Join the waitlist</h2>

                            <Input  
                                placeholder='Email'
                                callback={(email, ui_callback) => {
                                    fetch('/api/create_lead', {
                                        body: email,
                                        method: 'POST'
                                    })
                                        .then(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); })
                                        .catch(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); });
                                }}>	
                            </Input>
                        </div>
                    </div>

                    <p className="text-slate-400 text-sm my-0">By <a href="https://ben-white.vercel.app" className="text-slate-200 text-sm my-0">@benji</a></p>
                </div>
            </div>
        </div>
        
        
    )
}

export default Footer;