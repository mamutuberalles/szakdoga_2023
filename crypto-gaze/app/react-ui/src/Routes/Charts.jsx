import React, { useState, useEffect } from "react";
import axios from 'axios';
import { MyChart } from "../Basic Components/MyChart";
import { MyChartSettings } from "../Basic Components/MyChartSettings";
import { Button } from "@ui5/webcomponents-react";
import MyChart2 from "../Basic Components/MyChart2";

export function Charts() {

    const [chartValues, setChartValues] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);
    const [complexChartValues, setcomplexChartValues] = useState([]);
    const [complexDataFetched, setcomplexDataFetched] = useState(0);

    const fetchChart = async () => {
        const res = await axios.get("http://localhost:4004/chart/Chart");
        //console.log(res.data.value[0].ticker);
        setChartValues(res.data.value);
        setDataFetched(dataFetched + 1);

    };

    const fetchComplexChart = async () => {
        const res = await axios.get("http://localhost:4004/chart/MultiChart");
        //console.log(res.data.value[0].ticker);
        setcomplexChartValues(res.data.value);
        setcomplexDataFetched(complexDataFetched + 1);
    };

    useEffect(() => {
        if (dataFetched < 3 || complexDataFetched < 3) {
            fetchChart();
            fetchComplexChart();
        }
    })

    return (
        <>
            {chartValues.map(item =>
                <MyChart args={item} />
            )}
            {complexChartValues.map(item =>
                <MyChart2 args={item} />
            )}
        </>
    );


}

export default Charts;