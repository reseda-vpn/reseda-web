import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import styles from './UnUI.module.css'

import { ArrowRight, Check, CornerDownLeft, Heart, Key, Loader, RefreshCw, Repeat, Triangle } from 'react-feather'

interface Props { callback: Function, children?: React.ReactNode, enterCallback?: Function, noArrow: boolean };
declare type NativeAttrs = Omit<React.InputHTMLAttributes<any>, keyof Props>;

const InputField: React.FC<Props & NativeAttrs> = ({ children, callback, enterCallback, noArrow, ...args }) => {
    const input_ref = useRef<HTMLInputElement>(null);
    const [ value, setValue ] = useState("");

    return (
            <div 
                className={styles.inputField + " flex flex-row"}
             >
                <input
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if(e.key == "Enter") {
                            enterCallback(value);
                        }
                    }}
                    className="flex flex-1 outline-none"
                    onChange={() => {
                        callback(input_ref.current.value);
                        setValue(input_ref.current.value);
                    }}
                    ref={input_ref}
                    {...args}>
                    {
                        children ?? children
                    }
                </input>

                {
                    !noArrow ? 
                        value == "" ? 
                            <ArrowRight height={16} color={"#b4b4b4"} />
                        :
                            <ArrowRight height={16} color={"#252525"} onClick={() => {
                                enterCallback(value);
                            }}/>
                    :
                    <></>
                }
            </div>
        )  
}

export default InputField;