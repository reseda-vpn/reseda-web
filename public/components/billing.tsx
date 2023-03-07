import moment from 'moment';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp } from "react-feather"
import { Account, Usage } from '@prisma/client';
import Button from './un-ui/button';

export const Billing = ({ data, tier, usage, changeView }: { data: {up: number, down: number}, tier: string, usage: boolean, changeView: Function }) => {
    const [ thisMonthData, setThisMonthData ] = useState<{
        down: number,
        up: number
    }>(data);

    const [ usageMetrics, setUsageMetrics ] = useState(getUsage(thisMonthData, tier));

    useEffect(() => {
        setThisMonthData(data)
        setUsageMetrics(getUsage(data, tier))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
            <div className="flex sm:flex-row flex-col w-full rounded-lg overflow-hidden p-5 bg-[#F8F7F6] min-h-72 justify-between dark:!bg-[#ffffff0d]">
            <div className="flex flex-col">
                <div className="flex flex-row items-end">
                    <p className="text-xl dark:text-white">$</p>
                    <h2 className="text-3xl font-bold dark:text-white">{usageMetrics.cost.toFixed(2)}</h2>
                    <p className="text-gray-500 dark:text-gray-300">this month</p>
                </div>

                <div>
                    {
                        usageMetrics.plan == "SUPPORTER" ?
                            usageMetrics.net_50_usage < 0 ?
                            <p className="text-gray-500 dark:text-gray-300">Used <strong className="text-gray-900 dark:text-white">{getSize(data.down, 2)}</strong> of free 50GB ({((data.down / 50000000000) * 100).toFixed(2)}%). <strong className="text-gray-900 dark:text-white">{getSize(Math.abs(50000000000 - data.down), 2)}</strong> left </p>
                            :
                            <p className="text-gray-500 dark:text-gray-300">Used all free data allowance, overflowed <strong className="text-gray-900 dark:text-white">{getSize(usageMetrics.net_50_usage)}</strong></p>
                        :
                        usageMetrics.net_5_usage < 0 ?
                            <p className="text-gray-500 dark:text-gray-300">Used <strong className="text-gray-900 dark:text-white">{getSize(data.down, 2)}</strong> of free 5GB ({((data.down / 5000000000) * 100).toFixed(2)}%) <strong className="text-gray-900 dark:text-white">{getSize(Math.abs(5000000000 - data.down), 2)}</strong> left</p>
                            :
                            usageMetrics.plan == "FREE" ?
                            <p className="text-gray-500 dark:text-gray-300">Used all free data allowance, overflowed <strong className="text-gray-900 dark:text-white">{getSize(usageMetrics.net_5_usage)}</strong></p>
                            :
                            <p className="text-gray-500 dark:text-gray-300">Paying for <strong className="text-gray-900 dark:text-white">{getSize(usageMetrics.net_5_usage)}</strong> over 5GB free at ${(usageMetrics.data_rate).toFixed(3)} per GB. ({getSize(data.down)} Total). </p>

                    }
                </div>
                
            </div>

            <div className="flex-col flex-end items-center gap-2 hidden sm:flex">
                {
                    usage ? 
                    <Button onClick={() => {
                        changeView("usage")
                        // icon={<ArrowUpRight size={16} />}
                    }} icon={<ArrowUpRight size={16} />} className="h-8 px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer bg-gray-200/60 text-gray-900 hover:bg-gray-200 hover:text-gray-900">Detailed Usage</Button>
                    :
                    <></>
                }
            </div>
            
            {/* <div className="flex flex-col flex-1">
                <p className="text-gray-500">Current Usage</p>
                <div className="rounded-2xl w-full overflow-hidden bg-white max-h-4 h-full">
                    <div className="bg-violet-600 h-full" style={{ width: ((data.down / 5000000000) * 100).toFixed(2) }}></div>
                </div>
            </div> */}
        </div>
    )
}

export function getUsage(usage: { up: number, down: number }, plan) {
    const net_5_usage = (usage.up + usage.down) - 5000000000;
    const net_50_usage = (usage.up + usage.down) - 50000000000;

    const data_rate = (() => {switch(plan) {
        case "FREE":
            return 0
        case "BASIC":
            return 0.02
        case "PRO":
            return 0.024
        case "SUPPORTER":
            return 0
        default:
            return 0
    }})();

    let cost = 0;

    if(plan == "SUPPORTER") {
        cost = byteToGB(net_50_usage > 0 ? net_50_usage : 0) * data_rate
    }else {
        cost = byteToGB(net_5_usage > 0 ? net_5_usage : 0) * data_rate
    }

    return {
        data_rate,
        net_5_usage,
        net_50_usage,
        plan,
        cost: cost < 0 ? 0 : cost
    };
}

function byteToGB(byte) {
    return byte / (1000 * 1000 * 1000)
}

export function getSize(size, dp?) {
    var sizes = [' Bytes', ' KB', ' MB', ' GB', 
                 ' TB', ' PB', ' EB', ' ZB', ' YB'];
    
    for (var i = 1; i < sizes.length; i++) {
        if (size < Math.pow(1000, i)) 
            return (size / Math.pow(1000, i - 1)).toFixed(dp !== null ? dp : 2) + sizes[i - 1];
    }
    return size;
}

export default Billing;