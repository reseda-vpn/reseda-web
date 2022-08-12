import moment from 'moment';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from "react-feather"
import { Usage } from '@prisma/client';

export const Billing = ({ data, data_rates }) => {
    const [ thisMonthData, setThisMonthData ] = useState<{
        down: number,
        up: number
    }>(data);

    useEffect(() => {
        setThisMonthData(data)
    }, [data])

    return (
        <div className="flex flex-col w-full">
            <div className="bg-gray-300 rounded-lg">
                <h2 className="text-3xl">{getTotalUsage(thisMonthData?.down, data_rates.tier)}</h2>
            </div>
            {
                thisMonthData?.down
            }
        </div>
    )
}

function getTotalUsage(usage, plan) {
    return 5
}

export function getSize(size) {
    var sizes = [' Bytes', ' KB', ' MB', ' GB', 
                 ' TB', ' PB', ' EB', ' ZB', ' YB'];
    
    for (var i = 1; i < sizes.length; i++) {
        if (size < Math.pow(1024, i)) 
          return (Math.round((size / Math.pow(
            1024, i - 1)) * 100) / 100) + sizes[i - 1];
    }
    return size;
}

export default Billing;