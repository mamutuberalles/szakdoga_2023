import React from "react";
import MyChart2SettingsUpdate from "./MyChartSettings2Update";
import MyChartSettingsUpdate from "./MyChartSettingsUpdate";
export function ChartEditor({params, updaterFunction} ) {
    return (
        <>
             {params.chart_type === "simple"
                ? <MyChartSettingsUpdate args={params} updaterFunction = {updaterFunction} />
                : <> </>}

            {params.chart_type === "complex"
                ? <MyChart2SettingsUpdate args={params} updaterFunction = {updaterFunction}  />
                : <> </>} 
        </>
    );
}

export default ChartEditor;