import React, { useState, useEffect } from "react";
import axios from 'axios';
import { MyChart } from "../Basic Components/MyChart";
import { MyChartSettings } from "../Basic Components/MyChartSettings";
import { Button } from "@ui5/webcomponents-react";
import MyChart2 from "../Basic Components/MyChart2";

export function Charts() {

    const [fetchedCharts, setFetchedCharts] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);

    const fetchChart = async () => {
        const res = await axios.get('http://localhost:4004/chart/CustomCharts')
        setFetchedCharts(res.data.value)
        setDataFetched(dataFetched + 1)
    };

    useEffect(() => {
        if (dataFetched < 1) {
            fetchChart();
        }
    })

    return (
        <>
            {fetchedCharts.map(item =>
                item.chart_type == "simple" ?
                    <MyChart args = {item} /> :
                    <MyChart2 args = {item} />
            )}
        </>
    );
}

export default Charts;