import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import styles from './UnUI.module.css'

import { ArrowRight, CornerDownLeft, Key, Loader, Triangle } from 'react-feather'

interface Props { callback: Function, children?: React.ReactNode };
declare type NativeAttrs = Omit<React.InputHTMLAttributes<any>, keyof Props>;

const Input: React.FC<Props & NativeAttrs> = ({ children, callback, ...args }) => {
    const input_ref = useRef<HTMLInputElement>(null);
    const mail_format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const [ isValidEmail, setIsValidEmail ] = useState(false);
    const [ sendingAway, setSendingAway ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    return isValidEmail && sendingAway ?
        success ?
        (
            <div className={styles.input}>
                <p>Success!</p>

                <Loader size={20 } className={styles.spinning} />
            </div>
        ) 
        :
        (
            <div className={styles.input}>
                <p>Signing Up!</p>

                <Loader size={20 } className={styles.spinning} />
            </div>
        ) 
        :
        (
            <div className={styles.input}>
                <input 
                    onChange={() => {
                        if(input_ref?.current.value.trim().match(mail_format)) setIsValidEmail(true)
                        else setIsValidEmail(false);

                        const closeUI = () => {
                            setSuccess(true);
                        }

                        if(input_ref?.current) callback(input_ref.current.value, closeUI)
                    }}
                    onKeyPress={(e) => {
                        if(e.key == "Enter") setSendingAway(true);
                    }}
                    ref={input_ref}
                    {...args}>
                    {
                        children ?? children
                    }
                </input>

                {
                    isValidEmail ? 
                    <CornerDownLeft height={16} />
                    :
                    <ArrowRight height={16} color={isValidEmail ? "#252525" : "#b4b4b4"} />
                }
            </div>
        )  
}

export default Input;