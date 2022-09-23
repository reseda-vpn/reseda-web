import moment from 'moment';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from "react-feather"
import { Usage } from '@prisma/client';
import { getSize } from './billing';

export const LinearChart = ({ data, month }: { data: Usage[], month: number }) => {
    const [ thisMonthData, setThisMonthData ] = useState([]);
    const [ sortBy, setSortBy ] = useState("connStart");
    const [ sortForward, setSortForward ] = useState(true);

    useEffect(() => {
        console.log("Sorting through data again!");

        const new_data: Usage[] = data.filter(e => new Date(e.connStart).getMonth() == month).filter(e => parseInt(e.down) !== 0);

        new_data.sort((a, b) => { 
            switch (sortBy) {
                case "id":
                    return sortForward ? ('' + a.id).localeCompare(b.id) : ('' + b.id).localeCompare(a.id)
                case "connStart":
                    return sortForward ? new Date(b.connStart).getTime() - new Date(a.connStart).getTime() : new Date(a.connStart).getTime() - new Date(b.connStart).getTime()
                case "dur":
                    return sortForward ? (new Date(b.connEnd).getTime() - new Date(b.connStart).getTime()) - (new Date(a.connEnd).getTime() - new Date(a.connStart).getTime()) : (new Date(a.connEnd).getTime() - new Date(a.connStart).getTime()) - (new Date(b.connEnd).getTime() - new Date(b.connStart).getTime())
                case "up":
                    return sortForward ? parseInt(b.up) - parseInt(a.up) : parseInt(a.up) - parseInt(b.up)
                case "down":
                    return sortForward ? parseInt(b.down) - parseInt(a.down) : parseInt(a.down) - parseInt(b.down)
                default:
                    break;
            }
        })

        setThisMonthData(new_data);
    }, [data, month, sortBy, sortForward])

    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-4 text-slate-500 px-4 gap-2">
                {
                    [["Start", "connStart"], ["Duration", "dur"], ["Up", "up"], ["Down", "down"]].map(e => {
                        return (
                            <p key={e[0]} className="flex flex-row justify-between items-center cursor-pointer hover:bg-slate-100 rounded-sm px-1 py-1 select-none" onClick={() => {
                                if(sortBy !== e[1]) {
                                    setSortBy(e[1])
                                }else {
                                    setSortForward(!sortForward)
                                }
                            }}>{e[0]} 
                                {
                                    sortForward ? <ChevronDown className={`${sortBy == e[1] ? "flex" : "hidden"}`} /> : <ChevronUp className={`${sortBy == e[1] ? "flex" : "hidden"}`} />
                                }
                            </p>
                        )
                    })
                }
                {/* <p className="flex flex-row justify-between items-center cursor-pointer hover:bg-slate-100 rounded-sm px-1 py-1" onClick={() => setSortBy("connStart")}>Start <ChevronDown className={`${sortBy == "connStart" ? "flex" : "hidden"}`} /></p>
                <p className="flex flex-row justify-between items-center cursor-pointer hover:bg-slate-100 rounded-sm px-1 py-1" onClick={() => setSortBy("dur")}>Duration <ChevronDown className={`${sortBy == "dur" ? "flex" : "hidden"}`} /></p>
                <p className="flex flex-row justify-between items-center cursor-pointer hover:bg-slate-100 rounded-sm px-1 py-1" onClick={() => setSortBy("up")}>Up <ChevronDown className={`${sortBy == "up" ? "flex" : "hidden"}`} /></p>
                <p className="flex flex-row justify-between items-center cursor-pointer hover:bg-slate-100 rounded-sm px-1 py-1" onClick={() => setSortBy("down")}>Down <ChevronDown className={`${sortBy == "down" ? "flex" : "hidden"}`} /></p> */}
            </div>

            <br />

            {
                thisMonthData.map((e, indx) => {
                    return (
                        <div key={e.id} className={`grid grid-cols-4 hover:bg-[#efedeb] ${indx % 2 == 0 ? "bg-[#F8F7F6]" : "bg-white"} py-4 rounded-md px-4`}>
                            {/* <p className="">{e.serverId}</p> */}
                            <p>{moment(e.connStart).format("MMM Do")}</p>
                            <p>{moment.duration(moment(e.connStart).diff(moment(e.connEnd))).humanize()}</p>
                            <p>{getSize(e.up)}</p>
                            <p>{getSize(e.down)}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default LinearChart;