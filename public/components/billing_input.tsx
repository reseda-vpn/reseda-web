import validate from "card-validator"
import { useRef, useState, useEffect } from "react";
import Button from "./un-ui/button";

import {
    useStripe,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js"
import { HiExclamation } from "react-icons/hi";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
        color: "#000",
        fontFamily: 'Public Sans, Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
            color: "#aab7c4",
        },
        },
        invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
        },
    },
};

const BillingInput: React.FC<{ locationCallback }> = ({ locationCallback }) => {
    const [ billingInfoAccurate, setBillingInfoAccurate ] = useState({
        card: false,
        cvv: false,
        expiry: false
    });

    const [ billingErrors, setBillingErrors ] = useState<{
        type: "validation_error";
        code: string;
        message: string;
        source: "card" | "cvv" | "expiry" 
    } | null>(null);
    const [ invalidKeys, setInvalidKeys ] = useState([]);
    
    const stripe = useStripe();

    return (
        <div className="flex flex-col items-center max-w-[400px]">
            <h2 className="flex flex-1 w-full text-left font-semibold mb-1 text-gray-700 text-sm">Card Details</h2>
            <div className="rounded-md outline-none flex flex-col w-full" style={{ boxShadow: "rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 8%) 0px 2px 5px 0px" }}>
                <div className="flex py-5 px-3 h-10 gap-1 w-full flex-col justify-center">
                    {/* <p className="text-xs font-semibold select-none text-gray-600">CARD NUMBER</p> */}
                    <CardNumberElement
                        className="w-full font-sans"
                        options={CARD_ELEMENT_OPTIONS}
                        onChange={(e) => {
                            setBillingInfoAccurate({
                                ...billingInfoAccurate,
                                card: e.complete
                            })

                            if(e.error) {
                                setBillingErrors({
                                    ...e.error,
                                    source: "card"
                                })
                            }else if(billingErrors?.source == "card") {
                                setBillingErrors(null);
                            }
                        }}
                        />
                </div>

                <hr />

                <div className={`flex flex-row items-center py-0 px-3 h-10 gap-3 ${invalidKeys.includes("cvv") || invalidKeys.includes("card_date") ? "outline-red-400" : ""}`}>
                    <CardExpiryElement
                        className="w-full !static"
                        options={CARD_ELEMENT_OPTIONS}
                        onChange={(e) => {
                            setBillingInfoAccurate({
                                ...billingInfoAccurate,
                                expiry: e.complete
                            })
                            
                            if(e.error) {
                                setBillingErrors({
                                    ...e.error,
                                    source: "expiry"
                                })
                            }else if(billingErrors?.source == "expiry") {
                                setBillingErrors(null);
                            }
                        }}
                        />

                    <div className="h-full w-[1px] bg-[#e5e7eb]"></div>

                    <CardCvcElement
                        className="w-full"
                        options={CARD_ELEMENT_OPTIONS}
                        onChange={(e) => {
                            setBillingInfoAccurate({
                                ...billingInfoAccurate,
                                cvv: e.complete
                            })

                            if(e.error) {
                                setBillingErrors({
                                    ...e.error,
                                    source: "cvv"
                                })
                            }else if(billingErrors?.source == "cvv") {
                                setBillingErrors(null);
                            }
                        }}
                        />
                </div>
            </div>

            <br />

            {/* <h2 className="flex flex-1 w-full text-left font-semibold mb-1 text-gray-700 text-sm">Billing Address</h2>
            <div className="rounded-md outline-none flex flex-col w-full" style={{ boxShadow: "rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 8%) 0px 2px 5px 0px" }}>
                <div className="flex py-0 px-3 h-10">
                    <input value={billingInfo.billing_address} className="overflow-hidden outline-none w-full flex-1" type="text" placeholder="Country" onChange={(val) => {
                        setBillingInfo({
                            ...billingInfo,
                            billing_address: val.target.value
                        })
                    }} />
                </div>

                <hr />

                <div className="flex py-0 px-3 h-10">
                    <input value={billingInfo.zip_code} className="overflow-hidden outline-none w-full flex-1" type="text" placeholder="ZIP Code" onChange={(val) => {
                        setBillingInfo({
                            ...billingInfo,
                            zip_code: val.target.value
                        })
                    }} />
                </div>
            </div>

            <br /> */}

            {
                billingErrors ? 
                <>
                    <div className="flex flex-row items-center gap-2 bg-red-100 rounded-md px-3 py-2 w-full">
                        <HiExclamation color='#db5959' />
                        <p className="text-red-800">{billingErrors.message}</p>
                    </div>

                    <br />
                </>
                :
                <></>
            }

            <Button icon={<></>} className={`!static w-full ${!stripe || !(billingInfoAccurate.card && billingInfoAccurate.cvv && billingInfoAccurate.expiry) ? "bg-violet-200" : "bg-violet-600"} text-white text-sm font-semibold py-[18px]`} onClick={() => {
                if((billingInfoAccurate.card && billingInfoAccurate.cvv && billingInfoAccurate.expiry)) {
                    locationCallback()
                }
            }}>Subscribe</Button>
        </div>
    )
}

export default BillingInput