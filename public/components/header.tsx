import Button from './un-ui/button';

export const Header = () => {
    return (
        <div className="flex flex-row z-50 bg-white bg-opacity-80 backdrop-blur-md">
            <div className="flex flex-row py-2 px-4 justify-between max-w-screen-lg w-full my-0 mx-auto z-50">
                <div className="flex flex-row items-center gap-4">
                    <div className="font-bold font-altSans text-lg text-slate-800">RESEDA</div>   

                    <div className="flex flex-row items-center gap-4">
                        <Button icon={false} onClick={() => {
                            window.location.href = "./vpn"
                        }}>VPN</Button>
                        <Button icon={false}>Pricing</Button>
                        <Button icon={false}>Why Reseda?</Button>
                    </div> 
                </div>

                <div className="flex flex-row items-center gap-4">
                    <Button icon={false}>Login</Button>
                    <Button icon={false} style={{ background: "linear-gradient(-45deg, rgba(99,85,164,0.6) 0%, rgba(232,154,62,.6) 100%)", color: 'rgb(255,255,255)', fontWeight: '600' }}>Get Reseda</Button>
                </div>
            </div>
        </div>
        
    )
}

export default Header;