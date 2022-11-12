import { getUsage } from "./billing"

export const SelectionItem = ({ callback, quantity, numeric_quantity, description, plan, position, selected }: { callback: Function, quantity: string, numeric_quantity: number, description: string, plan: string, position: 0 | 1 | 2, selected: [ selection: number, index: number ] }) => {
    return (
        <div 
            onClick={() => callback()}
            className={`
                flex flex-row items-center justify-between border-[1px] border-gray-300 px-4 py-3 cursor-pointer 
                ${
                    position == 0 ? `${selected[0] == selected[1]+1 ? "border-b-0" : ""} rounded-lg rounded-b-none` 
                    : position == 1 ? `${selected[0] == selected[1]+1 ? "border-b-0" : ""} ${selected[0] == selected[1] ? "" : "border-t-0"}` 
                    : position == 2 ? `${selected[0] == selected[1] ? "" : "border-t-0"} rounded-lg rounded-t-none` 
                    : ""
                } 
                ${selected[0] == selected[1] ? "bg-violet-100 border-violet-300" : ""}
            `}>
            
            <div className="flex flex-row items-start gap-4">
                <div>
                    {
                        !(selected[0] == selected[1]) ? 
                        <div className="mt-1 h-4 w-4 rounded-full border-[2px] border-gray-300"></div>
                        :
                        <div className="mt-1 h-4 w-4 rounded-full border-[1px] border-violet-500 bg-violet-500 flex items-center justify-center">
                            {/* <div className="h-[7px] w-[7px] bg-white rounded-full"></div> */}
                        </div>
                    }
                </div>
                <div>
                    <p className={`font-bold select-none  ${selected[0] == selected[1] ? "text-violet-700" : ""}`}>{quantity}</p>
                    <p className={`select-none ${selected[0] == selected[1] ? "text-violet-800" : "text-gray-600 "}`}>{description}</p>
                </div>
            </div>
            
            {
                getUsage({ up: 0, down: numeric_quantity}, plan).cost < 0.01 ?
                <div className="flex flex-col justify-end items-end select-none">
                    <p className={`${selected[0] == selected[1] ? "text-violet-400" : "text-gray-400"}`}>Up to or more than</p>
                    <p className={`font-semibold ${selected[0] == selected[1] ? "text-violet-800" : "text-gray-800"}`}>${ (getUsage({ up: 0, down: numeric_quantity}, plan).cost).toFixed(2) } /mo</p>
                </div>
                :
                <div className="flex flex-col justify-end items-end select-none">
                    <p className={`${selected[0] == selected[1] ? "text-violet-400" : "text-gray-400"}`}>No more than</p>
                    <p className={`font-semibold ${selected[0] == selected[1] ? "text-violet-800" : "text-gray-800"}`}>${ (getUsage({ up: 0, down: numeric_quantity}, plan).cost).toFixed(2) } /mo</p>
                </div>
            }
            
        </div>
    )
}