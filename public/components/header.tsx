import styles from '../../styles/Home.module.css'
import Button from './un-ui/button';

export const Header = () => {
    return (
        <div className={styles.header}>
            <div>
                <div className={styles.resedaLogo}>RESEDA</div>   

                <div>
                    <Button icon={false} onClick={() => {
                        window.location.href = "./vpn"
                    }}>VPN</Button>
                    <Button icon={false}>Pricing</Button>
                    <Button icon={false}>Why Reseda?</Button>
                </div> 
            </div>

            <div>
                <Button icon={false}>Login</Button>
                <Button icon={false} style={{ background: "linear-gradient(-45deg, rgba(99,85,164,0.6) 0%, rgba(232,154,62,.6) 100%)", color: 'rgb(255,255,255)', fontWeight: '600' }}>Get Reseda</Button>
            </div>
        </div>
    )
}

export default Header;