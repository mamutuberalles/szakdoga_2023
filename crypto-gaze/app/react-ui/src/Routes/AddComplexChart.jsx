import React, {useState} from "react";
import MyChart2Settings from "../Basic Components/MyChart2Settings";

export function AddComplexChart() {

    const [chartValues,setChartValues] = useState({});

    return (
        <>
            <MyChart2Settings args = {chartValues} />
        </>
    );
}

export default AddComplexChart;