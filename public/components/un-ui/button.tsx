import { useEffect, useRef, useState } from "react";
import styles from './UnUI.module.css'

import { ArrowRight, Loader } from 'react-feather'

interface Props { icon?: any, inline?: boolean, children?: React.ReactNode, loaderOnly?: boolean };
declare type NativeAttrs = Omit<React.LinkHTMLAttributes<any>, keyof Props>;

const Button: React.FC<Props & NativeAttrs> = ({ icon, inline, children, className, loaderOnly, ...args }) => {
    return (
        <a 
            {...args}
            className={`${ inline ? styles.inlineButton : "flex items-center justify-center relative h-8 px-3 py-0 rounded-md font-sans hover:cursor-pointer outline-none gap-2 text-sm "+className }`}
            >
            {
                loaderOnly ? 
                <>
                    <Loader size={16} className={styles.spinning}/>
                </>
                :
                <>
                    {
                    children ?? children
                    }
        
                    {
                        icon == false ?
                            <></>
                        : 
                            icon ? icon : <ArrowRight size={16} />
                    }
                </>
            }
            
        </a>
    )
}

export default Button;