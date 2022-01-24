import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '@styles/Home.module.css'
import Button from './un-ui/button';
import { X } from 'react-feather';
import { Router, useRouter } from 'next/dist/client/router';

const Banner: React.FC<{ title: string, text: string, url: string }> = ({ title, text, url }) =>  {
    const [ visible, setVisible ] = useState(true);
    const router = useRouter();

    return visible ? (
        <div className={styles.banner}>
            <div>
                <h4>{title}</h4>
                <p>—{text}</p>
                <span></span>
                <Button inline={true} onClick={() => {
                    router.push(url);
                }}>Learn More</Button>
            </div>
            
            <X onClick={() => setVisible(false)} opacity={0.6} size={18}/>
        </div>
    ) : <></>;
}

export default Banner