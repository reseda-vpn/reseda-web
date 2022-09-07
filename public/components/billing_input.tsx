import validate from "card-validator"

const BillingInput: React.FC<{}> = () => {
    return (
        <div className="flex flex-col items-center max-w-[400px]">
            <h2 className="flex flex-1 w-full text-left font-semibold mb-1 text-gray-700 text-sm">Card Details</h2>
            <div className="rounded-md outline-none flex flex-col" style={{ boxShadow: "rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 8%) 0px 2px 5px 0px" }}>
                <div className="flex py-0 px-3 h-10">
                    <input className="overflow-hidden outline-none w-full flex-1" type="text" placeholder="Card number" onChange={(val) => {
                        const card = validate.number(val.target.value);

                        console.log(card);
                    }} />
                </div>

                <hr />

                <div className="flex flex-row items-center py-0 px-3 h-10 gap-3">
                    <input type="text" placeholder="MM/YY" className="overflow-hidden outline-none w-full flex-1"/>
                    <div className="h-full w-[1px] bg-[#e5e7eb]"></div>
                    <input type="text" placeholder="CVV" className="overflow-hidden outline-none w-full flex-1" />
                </div>
            </div>

            <br />

            <h2 className="flex flex-1 w-full text-left font-semibold mb-1 text-gray-700 text-sm">Billing Address</h2>
            <div className="rounded-md outline-none flex flex-col w-full" style={{ boxShadow: "rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 8%) 0px 2px 5px 0px" }}>
                <div className="flex py-0 px-3 h-10">
                    <input className="overflow-hidden outline-none w-full flex-1" type="text" placeholder="Country" onChange={(val) => {
                        const card = validate.number(val.target.value);

                        console.log(card);
                    }} />
                </div>

                <hr />

                <div className="flex py-0 px-3 h-10">
                    <input className="overflow-hidden outline-none w-full flex-1" type="text" placeholder="ZIP Code" onChange={(val) => {
                        const card = validate.number(val.target.value);

                        console.log(card);
                    }} />
                </div>
            </div>
        </div>
    )
}

export default BillingInput