import React, { useState, useEffect } from "react"
import { MyChart } from "../Basic Components/MyChart";
import axios from "axios";


export function Home() {
    const [fetchedCharts, setFetchedCharts] = useState([]);

    const [dataFetched, setDataFetched] = useState(0);

    const fetchData = async () => {
        const res = await axios.get('http://localhost:4004/chart/PreDefinedCharts')
        setFetchedCharts(res.data.value)
        setDataFetched(dataFetched +1);
    }

    useEffect(() =>{
        if(dataFetched < 1)
        {
            fetchData();
        }
    })
    return (
            <>
                {fetchedCharts.map(item =>
                    <MyChart args = {item} />  
                )}
            </>
    );
}