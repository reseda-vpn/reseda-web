import validate from "card-validator"
import { useRef, useState, useEffect } from "react";
import Button from "./un-ui/button";

const BillingInput: React.FC<{ autofill, locationCallback }> = ({ autofill, locationCallback }) => {
    const [ billingInfo, setBillingInfo ] = useState({
        card_number: null,
        card_date: null,
        cvv: null,

        billing_address: null,
        zip_code: null
    });
    const [ invalidKeys, setInvalidKeys ] = useState([]);

    const calculateValidity = (callbackFn) => {
        let invalid_keys: { item: string, reason: string }[] = [];

        console.log(billingInfo);

        // Check for any null entities
        for (let [key, value] of Object.entries(billingInfo)) {
            if(value == null) {
                invalid_keys.push({
                    item: key,
                    reason: "Value is null"
                })
            }
        }

        const mock_card = validate.number(billingInfo.card_number);
        if(!mock_card.isValid) {
            invalid_keys.push({
                item: "card_number",
                reason: "Not a valid card"
            });
        }

        const mock_cvv = validate.cvv(billingInfo.cvv);
        if(!mock_cvv.isValid) {
            invalid_keys.push({
                item: "cvv",
                reason: "Not a valid CVV number"
            });
        }

        const mock_date = validate.expirationDate(billingInfo.card_date);
        if(!mock_date.isValid) {
            invalid_keys.push({
                item: "card_date",
                reason: "Not a valid expiration date"
            });
        }

        callbackFn(invalid_keys);
    }

    useEffect(() => {
        calculateValidity((invalid_keys) => {
            if(invalid_keys.length !== 0) {
                console.log(invalid_keys);
                setInvalidKeys(invalid_keys);
            }else {
                setInvalidKeys([]);
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [billingInfo])

    const card_number = useRef<HTMLInputElement>();
    const card_date = useRef<HTMLInputElement>();
    const card_cvv = useRef<HTMLInputElement>();

    useEffect(() => {
        console.log("Updated billing information")
        setBillingInfo({
            ...autofill,
            cvv: null
        });
    }, [autofill])

    return (
        <div className="flex flex-col items-center max-w-[400px]">
            <h2 className="flex flex-1 w-full text-left font-semibold mb-1 text-gray-700 text-sm">Card Details</h2>
            <div className="rounded-md outline-none flex flex-col" style={{ boxShadow: "rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 8%) 0px 2px 5px 0px" }}>
                <div className="flex py-0 px-3 h-10">
                    <input value={billingInfo.card_number} className="overflow-hidden outline-none w-full flex-1" type="text" placeholder="Card number" ref={card_number} onChange={(val) => {
                        const card = validate.number(val.target.value);
                        const new_card = val.target.value.replace(/[^0-9]/g, "").replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();

                        card_number.current.value = new_card.substring(0,19);

                        setBillingInfo({
                            ...billingInfo,
                            card_number: new_card.substring(0,19)
                        })
                    }} />
                </div>

                <hr />

                <div className={`flex flex-row items-center py-0 px-3 h-10 gap-3 ${invalidKeys.includes("cvv") || invalidKeys.includes("card_date") ? "outline-red-400" : ""}`}>
                    <input value={billingInfo.card_date} ref={card_date} type="text" placeholder="MM/YY" className="overflow-hidden outline-none w-full flex-1"
                        onChange={(val) => {
                            let new_card = val.target.value
                                .replace(/[^0-9]/g, "")
                                .replace(/\W/gi, '')
                                .replace(/(.{2})/g, '$1/')
                                .trim()

                            if(new_card.endsWith('/')){
                                new_card = new_card.substring(0, new_card.length-1);
                            }

                            card_date.current.value = new_card.substring(0,5);

                            setBillingInfo({
                                ...billingInfo,
                                card_date: new_card.substring(0,5)
                            })
                        }}
                    />
                    <div className="h-full w-[1px] bg-[#e5e7eb]"></div>
                    <input value={billingInfo.cvv} ref={card_cvv} type="text" placeholder="CVV" className={`overflow-hidden outline-none w-full flex-1 `} onChange={(val) => {
                        let new_card = val.target.value
                            .substring(0, 4);

                        card_cvv.current.value = new_card;

                        setBillingInfo({
                            ...billingInfo,
                            cvv: val.target.value
                        })
                    }} />
                </div>
            </div>

            <br />

            <h2 className="flex flex-1 w-full text-left font-semibold mb-1 text-gray-700 text-sm">Billing Address</h2>
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

            <br />

            {/* <div className="flex flex-row items-center gap-2 bg-red-100 rounded-md px-3 py-2">
                <HiExclamation color='#db5959'></HiExclamation>
                <p className="text-red-800">Incomplete card details</p>
            </div> */}

            <br />

            <Button icon={<></>} className={`w-full ${invalidKeys.length > 0 ? "bg-violet-200" : "bg-violet-600"} text-white text-sm font-semibold py-[18px]`} onClick={() => {
                calculateValidity((invalid_keys) => {
                    if(invalid_keys.length == 0) locationCallback(billingInfo)
                    else {
                        console.log(invalid_keys);
                        setInvalidKeys(invalid_keys);
                    }
                })
            }}>Continue</Button>
        </div>
    )
}

export default BillingInput