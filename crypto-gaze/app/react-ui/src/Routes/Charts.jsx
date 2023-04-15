import React, { useState } from "react";
import axios from 'axios';
import { MyChart } from "../Basic Components/MyChart";
import { MyChartSetter } from "../Basic Components/MyChartSetter";
import { Button } from "@ui5/webcomponents-react";

export function Charts() {

    const [chartValues,setChartValues] = useState([]);

    const fetchChart = async () =>{
        const res = await axios.get("http://localhost:4004/chart/Chart");
        //console.log(res.data.value[0].ticker);
        setChartValues(res.data.value);
        
        console.log(res.data.value);
        
    };  

    return (
        <>
            <Button onClick={fetchChart} >
                Run Script
            </Button>
            {chartValues.map(item => 
               <MyChart args = {item} />     
            )}
        </>
    );

    
}

export default Charts;