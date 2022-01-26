import Button from './un-ui/button';

export const Footer = () => {
    return (
        <div className="flex flex-col w-full h-64 bg-slate-800">
            <div className="flex flex-row justify-between z-50 bg-slate-800 bg-opacity-80 backdrop-blur-md max-w-screen-lg w-full mx-auto h-full">
                <div className="px-0 py-8 flex flex-col justify-between h-full flex-1" >
                    <div className="font-bold font-altSans text-lg text-slate-100">RESEDA</div>   
                    <p className="text-slate-300">Made with :love:</p>
                </div>
                

            </div>
        </div>
        
        
    )
}

export default Footer;