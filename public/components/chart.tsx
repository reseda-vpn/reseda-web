import { getSize } from "@root/pages/profile";
import { useEffect, useRef, useState } from "react";

const Chart: React.FC<{ data: any[] }> = ({ data }) => {
    const now = new Date();
    const days_in_this_month = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();

    const [ max, setMax ] = useState(null);
    const [ chartDataSet, setChartDataSet ] = useState<{up: number, down: number}[]>([]);
    const a_ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dataSet = new Array(days_in_this_month)
        for (var i = 0; i < dataSet.length; i++) {
            dataSet[i] = { up: 0, down: 0, key: i+1 };
        }

        for(let i = 0; i < data.length; i++)
        {
            dataSet[new Date(data[i].key).getDate()-1].up += data[i].first;
            dataSet[new Date(data[i].key).getDate()-1].down += data[i].second;

        }

        setChartDataSet(dataSet);

        const max_first = data.reduce(function(max, obj) {
            return obj.first > max.first? obj : max;
        });

        const max_second = data.reduce(function(max, obj) {
            return obj.second > max.second? obj : max;
        });

        const largest = max_first.first > max_second.second ? max_first.first : max_second.second;
        setMax(largest);
    }, [data]);
    
    return (
        <div className="flex flex-1 h-full gap-2" ref={a_ref}>
            {
                chartDataSet.map((set: { up: number, down: number }, index: number) => {
                    return (
                        <div key={`DATA~${index}`} className="flex flex-col h-full items-center justify-center gap-1">
                            <div className="flex flex-row h-full items-end justify-end">
                                <div className={`w-3 bg-violet-200 rounded-t-sm rounded-bl-sm relative after:content-['${getSize(set.up)}'] after:flex after:text-slate-100 after:absolute`} style={{ height: `${(set.up / max * 100) > 0 ? set.up / max * 100 : 1}%` }}></div>
                                <div className="w-3 bg-violet-500 rounded-t-sm rounded-br-sm" style={{ height: `${(set.down / max * 100) > 0 ? set.down / max * 100 : 1}%` }} ></div>
                            </div>
                           
                           <div className="flex flex-col items-center justify-center">
                               <p className="opacity-50 font-altSans">{ new Date(now.getFullYear(), now.getMonth(), index+1).toLocaleDateString("en-nz", { day: "2-digit" }) }</p>
                           </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Chart