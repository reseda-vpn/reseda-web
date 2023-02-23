import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useMediaQuery from './media_query';
import Button from './un-ui/button';
import { ArrowDown, ChevronDown, ChevronUp } from "react-feather"
import { Usage } from '@prisma/client';
import Billing, { getSize } from './billing';
import Input from './un-ui/input';

export const BillingCalculator = () => {
    const [ tier, setTier ] = useState<"FREE" | "SUPPORTER" | "BASIC" | "PRO">("FREE");
    const [ data, setData ] = useState(15000000);

    return (
        <div className="flex flex-col w-full z-10 bg-white rounded-lg p-6 gap-2 border-2 border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                <div className='flex flex-col'>
                    <h2 className="font-bold text-xl">Price Calculator</h2>
                    <p className="text-gray-500">Estimate your monthy cost</p>
                </div>

                <div className="border-2 border-gray-200 rounded-md max-w-full">
                    <Input placeholder='50GB' onChange={(e) => setData(e.currentTarget.value * (1000 * 1000 * 1000))} callback={(val) => {}}></Input>
                </div>

                <div className="flex flex-row items-center gap-4 flex-wrap">
                    <div onClick={() => setTier("FREE")} className={`border-1 h-8 px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer border-2 border-transparent ${tier == "FREE" ? "bg-orange-100 border-2 border-orange-200" : "bg-orange-50/60"} hover:bg-orange-100 `}>
                        <h2 className="text-sm font-semibold text-orange-300 cursor-pointer" >FREE</h2>
                    </div>
                    <div onClick={() => setTier("SUPPORTER")} className={`border-1 h-8 px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer border-2 border-transparent ${tier == "SUPPORTER" ? "bg-violet-100 border-2 border-violet-200" : "bg-violet-100/60"} hover:bg-violet-100`}>
                        <h2 className="text-sm font-semibold text-orange-300 cursor-pointer bg-gradient-to-tr text-transparent bg-clip-text" >SUPPORTER</h2>
                    </div>
                    <div onClick={() => setTier("BASIC")} className={`border-1 h-8 px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer border-2 border-transparent ${tier == "BASIC" ? "bg-orange-100 border-2 border-orange-200" : "bg-orange-50/60"}  hover:bg-orange-100`}>
                        <h2 className="text-sm font-semibold text-orange-400 cursor-pointer" >BASIC</h2>
                    </div>
                    <div onClick={() => setTier("PRO")} className={`border-1 h-8 px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer border-2 border-transparent ${tier == "PRO" ? "bg-orange-100 border-2 border-orange-200" : "bg-orange-50/60"}  hover:bg-orange-100`}>
                        <h2 className="text-sm font-semibold text-orange-500 cursor-pointer" >PRO</h2>
                    </div>
                </div>
            </div>
            

            <Billing data={{ up: 0, down: data }} tier={tier} changeView={() => {}} usage={false} ></Billing>
        </div>
    )
}

export default BillingCalculator;