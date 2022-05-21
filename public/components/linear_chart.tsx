import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useMediaQuery from './media_query';
import Button from './un-ui/button';

export const LinearChart = ({ data, month }) => {
    const [ thisMonthData, setThisMonthData ] = useState([]);
    const [ sortBy, setSortBy ] = useState("connStart");
    const [ sortForward, setSortForward ] = useState(true);

    useEffect(() => {
        const new_data: any[] = data.filter(e => new Date(e.connStart).getMonth() == month);

        new_data.sort((a, b) => { 
            switch (sortBy) {
                case "id":
                    return ('' + a.id).localeCompare(b.id); 
                case "connStart":
                    return new Date(b.connStart).getTime() - new Date(a.connStart).getTime()  
                case "dur":
                    return (new Date(b.connEnd).getTime() - new Date(b.connStart).getTime()) - (new Date(a.connEnd).getTime() - new Date(a.connStart).getTime())
                case "up":
                    return b.up - a.up
                case "down":
                    return b.down - a.down
                default:
                    break;
            }
        })

        setThisMonthData(new_data);
    }, [data, month, sortBy])

    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-5 text-slate-500 px-4">
                <p onClick={() => setSortBy("id")}>Server</p>
                <p onClick={() => setSortBy("connStart")}>Start</p>
                <p onClick={() => setSortBy("dur")}>Duration</p>
                <p onClick={() => setSortBy("up")}>Up</p>
                <p onClick={() => setSortBy("down")}>Down</p>
            </div>

            <br />

            {
                thisMonthData.map((e, indx) => {
                    return (
                        <div key={e.id} className={`grid grid-cols-5 hover:bg-violet-100 ${indx % 2 == 0 ? "bg-violet-50 bg-opacity-80" : "bg-white"} py-4 rounded-md px-4`}>
                            <p className="">{e.serverId}</p>
                            <p>{moment(e.connStart).format("MMM Do")}</p>
                            <p>{ moment.duration(moment(e.connStart).diff(moment(e.connEnd))).humanize()}</p>
                            <p>{getSize(e.up)}</p>
                            <p>{getSize(e.down)}</p>
                        </div>
                    )
                })
            }
        </div>
    )
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

export default LinearChart;