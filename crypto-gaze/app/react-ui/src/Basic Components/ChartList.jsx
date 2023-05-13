import React, { useEffect } from "react";
import { MyChart } from "./MyChart";
import MyChart2 from "./MyChart2";
export default function ChartList(charts) {
    return (
        <>
            {charts.charts.map(item =>
                item.chart_type == "simple" ?
                    <MyChart args={item} /> :
                    <MyChart2 args={item} />
            )}
        </>
    );
}