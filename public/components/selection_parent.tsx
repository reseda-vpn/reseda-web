import { useState } from "react";
import { getUsage } from "./billing"
import { SelectionItem } from "./select_item";
import Input from "./un-ui/input";

export const SelectionParent = ({ plan }: { plan: string }) => {
    const [ selectedItem, setSelectedItem ] = useState(0);

    const onClick = (indx) => setSelectedItem(indx);

    return (
        <div>
            <SelectionItem callback={() => onClick(0)} selected={[selectedItem, 0]} quantity={"100GB"}      numeric_quantity={100000000000}  description={"Great for streaming"}                            plan={plan} position={0} />
            <SelectionItem callback={() => onClick(1)} selected={[selectedItem, 1]} quantity={"200GB"}      numeric_quantity={200000000000}  description={"Excellent for 4K streaming"}                      plan={plan} position={1} />
            <SelectionItem callback={() => onClick(2)} selected={[selectedItem, 2]} quantity={"500GB"}      numeric_quantity={500000000000}  description={"Best for file transfers or heavy workload users"} plan={plan} position={1} />
            <SelectionItem callback={() => onClick(3)} selected={[selectedItem, 3]} quantity={"Unlocked"}   numeric_quantity={-1}            description={"For the no limits experience"}                    plan={plan} position={2} />
            
            <br />
            
            <div className="flex flex-row items-center justify-between rounded-lg px-4 py-3" onClick={() => setSelectedItem(4)}>
                <div className="flex flex-row items-start gap-4">
                    <div>
                        <p className={`font-bold ${selectedItem == 4 ? "text-violet-600" : ""}`}>Custom</p>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input type="text" name="price" id="price" className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="0.00" />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                <label className="sr-only">Currency</label>
                                <select id="currency" name="currency" className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                    <option>USD</option>
                                    <option>CAD</option>
                                    <option>EUR</option>
                                </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-end items-end">
                    <p className={`text-gray-600 ${selectedItem == 4 ? "text-violet-400" : ""}`}>No more than</p>
                    <p className={`font-semibold ${selectedItem == 4 ? "text-violet-600" : ""}`}>{ getUsage({ up: 0, down: 1000000000000}, plan).cost.toFixed(2) } /mo</p>
                </div>
            </div>
        </div>
    )
}