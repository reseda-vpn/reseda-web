import { useState } from "react";
import { getUsage } from "./billing"
import { SelectionItem } from "./select_item";

export const SelectionParent = ({ plan }: { plan: string }) => {
    const [ selectedItem, setSelectedItem ] = useState(0);

    const onClick = (indx) => setSelectedItem(indx);

    return (
        <div>
            <SelectionItem callback={() => onClick(0)} selected={selectedItem == 0} quantity={"100GB"} numeric_quantity={100000000000}  description={"Great for streaming"}                            plan={plan} position={0} />
            <SelectionItem callback={() => onClick(1)} selected={selectedItem == 1} quantity={"200GB"} numeric_quantity={200000000000}  description={"Excellent for 4K streaming"}                      plan={plan} position={1} />
            <SelectionItem callback={() => onClick(2)} selected={selectedItem == 2} quantity={"500GB"} numeric_quantity={500000000000}  description={"Best for file transfers or heavy workload users"} plan={plan} position={1} />
            <SelectionItem callback={() => onClick(3)} selected={selectedItem == 3} quantity={"1TB"}   numeric_quantity={1000000000000} description={"For the no limits experience"}                    plan={plan} position={2} />
        </div>
    )
}