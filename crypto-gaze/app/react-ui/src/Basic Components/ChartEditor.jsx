import React, {useEffect} from "react";

import MyChart2SettingsUpdate from "./MyChartSettings2Update";
import MyChartSettingsUpdate from "./MyChartSettingsUpdate";
import { Title } from '@ui5/webcomponents-react';

export function ChartEditor({params, updaterFunction} ) {

    useEffect( () =>{
        console.log("[DEBUG] Edited chart type: " + params.chart_type)
    } )

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