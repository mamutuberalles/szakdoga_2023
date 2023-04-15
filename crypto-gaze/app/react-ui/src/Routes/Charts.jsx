import React, { useState, useEffect } from "react";
import axios from 'axios';
import { MyChart } from "../Basic Components/MyChart";
import { MyChartSetter } from "../Basic Components/MyChartSetter";
import { Button } from "@ui5/webcomponents-react";

export function Charts() {

    const [chartValues,setChartValues] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);

    const fetchChart = async () =>{
        const res = await axios.get("http://localhost:4004/chart/Chart");
        //console.log(res.data.value[0].ticker);
        setChartValues(res.data.value);
        
        setDataFetched(dataFetched +1);
        
    };  

    useEffect(() =>{
        if(dataFetched < 5)
        {
            fetchChart();
            setDataFetched(dataFetched +1);
        }
    })

    return (
        <>
{/*             <Button onClick={fetchChart} >
                Run Script
            </Button> */}
            {chartValues.map(item => 
               <MyChart args = {item} />     
            )}
        </>
    );

    
}

export default Charts;