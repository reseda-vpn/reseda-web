import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import styles from './UnUI.module.css'

import { ArrowRight, Check, CornerDownLeft, Heart, Key, Loader, Triangle } from 'react-feather'

interface Props { callback: Function, children?: React.ReactNode };
declare type NativeAttrs = Omit<React.InputHTMLAttributes<any>, keyof Props>;

const Input: React.FC<Props & NativeAttrs> = ({ children, callback, ...args }) => {
    const input_ref = useRef<HTMLInputElement>(null);
    const mail_format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const [ isValidEmail, setIsValidEmail ] = useState(false);
    const [ sendingAway, setSendingAway ] = useState(false);
    const [ success, setSuccess ] = useState<String>("nsy");

    const sendAway = () => {
        setSendingAway(true);
        if(input_ref?.current) callback(input_ref.current.value, (val: { res: String, err: any }) => { 
            console.log(val?.err);

            setSuccess(val?.res);
        })
    }

    return isValidEmail && sendingAway ?
        success == "success" ?
        (
            <div className={styles.input} style={{ backgroundColor: 'rgb(219 255 228)', color: 'green', boxShadow: 'rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(157 255 132 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(123 255 107 / 8%) 0px 2px 5px 0px' }}>
                <p>Success!</p>

                <Check size={20 } />
            </div>
        ) 
        :
        success == "exists"
        ?
        (
            <div className={styles.input} style={{ backgroundColor: '#e3d7fe', color: '#9063f6', boxShadow: 'rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(227 215 254) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(227 215 254) 0px 2px 5px 0px' }}>
                <p>You are already on the waitlist!</p>

                <Check size={18} />
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
                    }}
                    onKeyPress={(e) => {
                        if(e.key == "Enter") {
                            sendAway();
                        }
                    }}
                    ref={input_ref}
                    {...args}>
                    {
                        children ?? children
                    }
                </input>

                {
                    // isValidEmail ? 
                    // <CornerDownLeft height={16} />
                    // :
                    <ArrowRight height={16} color={isValidEmail ? "#252525" : "#b4b4b4"} onClick={() => {
                        sendAway();
                    }}/>
                }
            </div>
        )  
}

export default Input;