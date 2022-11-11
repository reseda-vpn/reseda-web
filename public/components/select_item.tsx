import { getUsage } from "./billing"

export const SelectionItem = ({ callback, quantity, numeric_quantity, description, plan, position, selected }: { callback: Function, quantity: string, numeric_quantity: number, description: string, plan: string, position: 0 | 1 | 2, selected: boolean  }) => {
    return (
        <div 
            onClick={() => callback()}
            className={`flex flex-row items-center justify-between border-[1px] border-gray-300 px-4 py-3 ${position == 0 ? "rounded-lg rounded-b-none" : position == 1 ? "border-t-0" : position == 2 ? "border-t-0 rounded-lg rounded-t-none" : ""} ${selected ? "bg-violet-100 border-violet-300" : ""}`}
            >
            
            <div className="flex flex-row items-start gap-4">
                <div>
                    <div className="mt-1 h-4 w-4 rounded-full border-[1px] border-gray-300"></div>
                </div>
                <div>
                    <p className={`font-bold ${selected ? "text-violet-700" : ""}`}>{quantity}</p>
                    <p className={`text-gray-600 ${selected ? "text-violet-500" : ""}`}>{description}</p>
                </div>
            </div>
            <div className="flex flex-col justify-end items-end">
                <p className="text-gray-600">No more than</p>
                <p className="font-semibold">${ getUsage({ up: 0, down: numeric_quantity}, plan).cost.toFixed(2) } /mo</p>
            </div>
        </div>
    )
}