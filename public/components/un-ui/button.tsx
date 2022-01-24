import { useEffect, useRef, useState } from "react";
import styles from './UnUI.module.css'

import { ArrowRight } from 'react-feather'

interface Props { icon?: any, inline?: boolean, children?: React.ReactNode };
declare type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof Props>;

const Button: React.FC<Props & NativeAttrs> = ({ icon, inline, children, ...args }) => {
    return (
        <button 
            className={`${ inline ? styles.inlineButton : styles.button }`}
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