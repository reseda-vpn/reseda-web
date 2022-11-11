import { useState } from "react";
import { getUsage } from "./billing"
import { SelectionItem } from "./select_item";
import Button from "./un-ui/button";
import Input from "./un-ui/input";
import { useEffect } from "react"

export const SelectionParent = ({ plan, callback }: { plan: string, callback: Function }) => {
    const [ selectedItem, setSelectedItem ] = useState(0);
    const [ chosenQuantity, setChosenQuantity ] = useState(-1);
    const [ inputQuantity, setInputQuantity ] = useState(0);
    const onClick = (indx) => setSelectedItem(indx);

    useEffect(() => {
        setChosenQuantity(Number.isNaN(inputQuantity) ? 0 : inputQuantity);
    }, [inputQuantity])

    return (
        <div className="flex flex-col w-full">
            <SelectionItem callback={() => { onClick(0); setChosenQuantity(100000000000) }} selected={[selectedItem, 0]} quantity={"100GB"}      numeric_quantity={100000000000}  description={"Great for streaming"}                            plan={plan} position={0} />
            <SelectionItem callback={() => { onClick(1); setChosenQuantity(200000000000) }} selected={[selectedItem, 1]} quantity={"200GB"}      numeric_quantity={200000000000}  description={"Excellent for 4K streaming"}                      plan={plan} position={1} />
            <SelectionItem callback={() => { onClick(2); setChosenQuantity(500000000000) }} selected={[selectedItem, 2]} quantity={"500GB"}      numeric_quantity={500000000000}  description={"Best for file transfers or heavy workload users"} plan={plan} position={1} />
            <SelectionItem callback={() => { onClick(3); setChosenQuantity(-1) }}           selected={[selectedItem, 3]} quantity={"Unlocked"}   numeric_quantity={-1}            description={"For the no limits experience"}                    plan={plan} position={2} />
            
            <br />
            
            <div className="flex flex-row items-center justify-between rounded-lg px-4 py-3" onClick={() => { setSelectedItem(4); setChosenQuantity(inputQuantity) }}>
                <div className="flex flex-row items-start gap-4">
                    <div>
                        <p className={`font-bold ${selectedItem == 4 ? "text-violet-600" : ""}`}>Custom</p>
                        
                        <div className="flex flex-row items-center overflow-hidden shadow-sm">
                            <div className={`pointer-events-none px-2 border-[2px] rounded-md rounded-r-none  ${selectedItem == 4 ? "border-violet-500 bg-violet-100 text-violet-500" : "bg-gray-100 text-gray-500"}`}>
                                <p className="">GB</p>
                            </div>

                            <input onChange={(e) => { setInputQuantity(parseInt(e.target.value)) }} type="text" className={`rounded-md rounded-l-none border-[2px] border-l-0 bg-white pl-1 outline-none ${selectedItem == 4 ? "border-violet-500" : ""} `} placeholder="100" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-end items-end">
                    <p className={`text-gray-600 ${selectedItem == 4 ? "text-violet-400" : ""}`}>No more than</p>
                    <p className={`font-semibold ${selectedItem == 4 ? "text-violet-600" : ""}`}>{ getUsage({ up: 0, down: 1000000000 * inputQuantity}, plan).cost.toFixed(2) } /mo</p>
                </div>
            </div>

            <br />

            <Button icon={<></>} className={`bg-violet-100 self-center w-64 text-sm font-semibold py-[18px] select-none ${chosenQuantity == 0 ? "bg-violet-100 text-violet-300 hover:!bg-violet-100 hover:!cursor-default" : "bg-violet-800 text-white"}`} onClick={() => {
                callback(chosenQuantity == -1 ? -1 : chosenQuantity * 1000000000)
            }}>
               Continue
            </Button>
        </div>
    )
}