import React, { useState } from "react";
import { Button } from '@mui/material'
import { MyChart } from '../Basic Components/MyChart';
import { MyChart2 } from '../Basic Components/MyChart2';
import MyChartSettings from "../Basic Components/MyChartSettings";
import MyChart2Settings from "../Basic Components/MyChart2Settings";

export function ChartBuilder() {

    const [chartType, setChartType] = useState("simple");
    const [chartValues,setChartValues] = useState({});

    const refreshChart = () =>{
        setChartValues({
            ticker: "BTC",
            type: "close",
            label: "BTC - USD"
        })
    }

    const chartTypeSet = (arg) => {
        setChartType(arg);
    }

    return (
        <>
            <Button onClick={refreshChart}>
                Refresh Chart
            </Button>
            <Button onClick={() => setChartType("simple")}>
                Use Simple Chart
            </Button>
            <Button onClick={() => setChartType("complex")}>
                Use Complex Chart
            </Button>
            {chartType === "simple"
                ? <MyChartSettings args = {chartValues} />
                : < MyChart2Settings args = {chartValues} />
            }
        </>
    );
}

export default ChartBuilder;