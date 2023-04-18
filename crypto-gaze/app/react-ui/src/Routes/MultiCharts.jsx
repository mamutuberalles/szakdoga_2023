import React, {useState, useEffect} from "react";
import axios from "axios";
import MyChart2 from '../Basic Components/MyChart2';

export function MultiCharts() {

    const [chartValues,setChartValues] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);
    

    const fetchChart = async () =>{
        const res = await axios.get("http://localhost:4004/chart/MultiChart");
        //console.log(res.data.value[0].ticker);
        setChartValues(res.data.value);
        setDataFetched(dataFetched +1);
    };


    useEffect(() =>{
        if(dataFetched < 3)
        {
            fetchChart();
        }
    })

    return (
        <>
            {chartValues.map(item => 
               <MyChart2 args = {item} />     
            )}
        </>
    );
}

export default MultiCharts;