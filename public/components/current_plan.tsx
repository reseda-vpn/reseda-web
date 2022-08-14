import moment from 'moment';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, ChevronUp } from "react-feather"
import { Account, Usage } from '@prisma/client';
import Button from './un-ui/button';

export const CurrentPlan = ({ tier }: {tier: string }) => {
    return (
        <div className="flex flex-col sm:flex-row w-full rounded-lg overflow-hidden p-5 gap-2 sm:gap-16 bg-white border-1 border-gray-200 min-h-72 justify-between border border-gray-300/60 shadow-lg shadow-transparent hover:shadow-gray-100/80 transition-shadow duration-450 ease-in-out">
            <div className="flex flex-col">
                <p className="text-gray-500">Current Plan</p>

                {
                    (() => {
                        switch(tier) {
                            case "FREE":
                                return (
                                    <>
                                        <h2 className="text-lg font-semibold text-orange-300 cursor-pointer">FREE</h2>
                                    </>
                                )
                            case "BASIC":
                                return (
                                    <>
                                        <h2 className="text-lg font-semibold text-orange-400 cursor-pointer">BASIC</h2>
                                    </>
                                )
                            case "PRO":
                                return (
                                    <>
                                        <h2 className="text-lg font-semibold text-orange-500 cursor-pointer">PRO</h2>
                                    </>
                                )
                            case "SUPPORTER":
                                return (
                                    <>
                                        <h2 className="text-lg font-semibold text-orange-300 cursor-pointer bg-gradient-to-tr text-transparent bg-clip-text">SUPPORTER</h2>
                                    </>
                                )
                            default:
                                return (
                                    <></>
                                )
                        }
                    })()
                }
            </div>

            <div className="flex flex-1">
                {
                    (() => {
                        switch(tier) {
                            case "FREE":
                                return (
                                    <>
                                        <div className="flex flex-col flex-1 justify-around">	
                                            <div className="flex flex-row gap-2 items-center">
                                                <div className="h-4 w-4 rounded-full bg-orange-300 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700">5GB/mo Free</div>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center ">
                                                <div className="h-4 w-4 rounded-full bg-orange-300 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700"><strong className="text-orange-300 rounded-sm py-0 px-1" >50MB/s</strong> Transfer</div>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center ">
                                                <div className="h-4 w-4 rounded-full bg-orange-300 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700">1 Device</div>
                                            </div>
                                        </div>
                                    </>
                                )
                            case "BASIC":
                                return (
                                    <>
                                        <div className="flex flex-col flex-1 justify-around">
                                            <div className="flex flex-row gap-2 items-center ">
                                                <div className="h-4 w-4 rounded-full bg-orange-400 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700"><strong className="text-orange-400 rounded-sm py-0 px-1" >500MB/s</strong> Max Transfer</div>
                                            </div>	
                                            <div className="flex flex-row gap-2 items-center ">
                                                <div className="h-4 w-4 rounded-full bg-orange-400 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700">Unlimited Data Cap</div>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center ">
                                                <div className="h-4 w-4 rounded-full bg-orange-400 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700">5 Device Max</div>
                                            </div>
                                        </div>
                                    </>
                                )
                            case "PRO":
                                return (
                                    <>
                                        <div className="flex flex-col flex-1 justify-around">	
                                            <div className="flex flex-row gap-2 items-center ">
                                                <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700">Unlimited Data Rate</div>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center ">
                                                <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700">Unlimited Data Cap</div>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center ">
                                                <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700">Unlimited Devices</div>
                                            </div>
                                        </div>
                                    </>
                                )
                            case "SUPPORTER":
                                return (
                                    <>
                                        <div className="flex flex-col flex-1 justify-around">	
                                            <div className="flex flex-row gap-2 items-center">
                                                <div className="h-4 w-4 rounded-full bg-gradient-to-tr flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700">50GB Free</div>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center ">
                                                <div className="h-4 w-4 rounded-full bg-gradient-to-tr flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700">Unlimited Data Rate</div>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center ">
                                                <div className="h-4 w-4 rounded-full bg-gradient-to-tr flex items-center justify-center"><Check size={12} color={"#fff"} /></div>
                                                <div className="text-base text-slate-700">Unlimited Devices </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            default:
                                return (
                                    <></>
                                )
                        }
                    })()
                }
            </div>

            <div className="flex flex-col gap-2">
                <Button onClick={() => {
                }} icon={<></>} className="h-8 px-3.5 rounded-md inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 transition-colors duration-150 ease-in-out leading-none cursor-pointer bg-violet-200/60 text-violet-900 hover:bg-violet-200 hover:text-violet-900">Change Plan</Button>
            </div>
        </div>
    )
}

export default CurrentPlan;