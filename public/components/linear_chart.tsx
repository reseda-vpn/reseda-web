import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useMediaQuery from './media_query';
import Button from './un-ui/button';

export const LinearChart = ({ data, month }) => {
    const [ thisMonthData, setThisMonthData ] = useState([]);

    useEffect(() => {
        const new_data = data.filter(e => new Date(e.connStart).getMonth() == month);

        setThisMonthData(new_data);
    }, [data, month])

    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-5 text-slate-500 px-4">
                <p>Server</p>
                <p>Start</p>
                <p>Duration</p>
                <p>Up</p>
                <p>Down</p>
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