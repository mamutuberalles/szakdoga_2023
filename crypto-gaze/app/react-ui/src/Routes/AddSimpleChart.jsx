import React, {useState} from "react";
import MyChartSettings from "../Basic Components/MyChartSettings";

export function AddSimpleChart() {

    const [chartValues,setChartValues] = useState({});

    return (
        <>  
            <MyChartSettings args = {chartValues} />
        </>
    );
}
export default AddSimpleChart;