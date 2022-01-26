import { useEffect, useRef, useState } from "react";
import styles from './UnUI.module.css'

import { ArrowRight } from 'react-feather'

interface Props { icon?: any, inline?: boolean, children?: React.ReactNode };
declare type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof Props>;

const Button: React.FC<Props & NativeAttrs> = ({ icon, inline, children, ...args }) => {
    return (
        <button 
            className={`${ inline ? styles.inlineButton : "flex items-center justify-center relative h-8 px-3 py-0 rounded-md font-sans hover:cursor-pointer outline-none gap-2 text-sm text-slate-100 sm:text-slate-600" }`}
            {...args}>
            {
                children ?? children
            }

            {
                icon == false ?
                    <></>
                : 
                    icon ? icon : <ArrowRight size={16} />
            }
        </button>
    )
}

export default Button;