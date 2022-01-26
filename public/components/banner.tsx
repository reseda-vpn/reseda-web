import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '@styles/Home.module.css'
import Button from './un-ui/button';
import { X } from 'react-feather';
import { Router, useRouter } from 'next/dist/client/router';

const Banner: React.FC<{ title: string, text: string, url: string }> = ({ title, text, url }) =>  {
    const [ visible, setVisible ] = useState(true);
    const router = useRouter();

    return visible ? (
        <div className="w-full bg-black text-white flex flex-row items-center justify-between py-4 px-4 z-50 relative t">
            <div className="flex flex-row items-center justify-center z-50 flex-1">
                <h4 className="text-sm hidden sm:flex">{title}</h4>
                <p className="text-sm my-0 opacity-80 hidden sm:flex">—</p>
                <p className="text-sm my-0 opacity-80">{text}</p>
                <span className="h-3 text-white bg-white border-none opacity-60 ml-2 hidden sm:flex" style={{ width: '1px' }}></span>
                <Button 
                    className="text-sm mx-2 hidden sm:flex flex-row items-center "
                    inline={true}
                    onClick={() => {
                        router.push(url);
                    }}>
                        Learn More
                </Button>
            </div>
            
            <X onClick={() => setVisible(false)} opacity={0.6} size={18}/>
        </div>
    ) : <></>;
}

export default Banner