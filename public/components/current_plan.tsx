import moment from 'moment';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, ChevronUp, Edit2 } from "react-feather"
import { Account, Usage } from '@prisma/client';
import Button from './un-ui/button';
import { useRouter } from 'next/router';
import { getSize } from './billing';

export const CurrentPlan = ({ tier, limit, callback }: {tier: string, limit: string, callback: Function }) => {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row w-full rounded-lg overflow-hidden p-5 gap-2 sm:gap-16 bg-white border-1 border-gray-200 min-h-72 justify-between border border-gray-300/60 shadow-lg shadow-transparent hover:shadow-gray-100/80 transition-shadow duration-450 ease-in-out">
            <div className="flex flex-col">
                <p className="text-gray-400">Current Plan</p>

                <div className="flex flex-row items-center gap-2">
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

                    <Edit2 onClick={() => {
                        router.push("/billing/plan")
                    }} size={16} className="text-orange-500 hover:cursor-pointer" fill="#FDBA74"></Edit2>
                </div>
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

            <div>
                <p className="text-gray-400">Usage Limit</p>

                <div className="flex flex-row items-center gap-2">
                    <p className="font-bold rounded-full bg-violet-200 text-violet-800 px-3 w-fit">{ limit == "-1" ? "Unlocked" : getSize(limit) }</p>

                    <Edit2 onClick={() => {
                        callback();
                    }} size={16} className="text-violet-500 hover:cursor-pointer" fill="#C4B5FD"></Edit2>
                </div>
            </div>
        </div>
    )
}

export default CurrentPlan;