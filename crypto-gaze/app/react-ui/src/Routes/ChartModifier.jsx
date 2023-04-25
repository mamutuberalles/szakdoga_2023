import React, { useState, useEffect } from "react";
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import MyChartSettings from "../Basic Components/MyChartSettings";
import MyChart2Settings from "../Basic Components/MyChart2Settings";
import { useNavigate } from "react-router-dom";


export function ChartModifier() {

    const navigate = useNavigate();

    const [chartSelected, setChartSelected] = useState();
    const [charts, setCharts] = useState([])
    const [chartData, setChartData] = useState([])
    const [chartType, setChartType] = useState("none")
    const [update, setUpdate] = useState("True")

    const fetchCharts = async () => {
        const res = await axios.get('http://localhost:4004/chart/CustomCharts')
        setCharts(res.data.value)
        console.log(res)

    }

    useEffect(() => {
        if (charts.length < 1) {
            fetchCharts();
        }
        if (chartSelected != "") {
            redrawChart()
        }

    }, [chartSelected])


    const redrawChart = () => {
        console.log("Redraw Chart")
        console.log(charts)
        let chart = charts.find(item => item["id"] == chartSelected)
        chart = {...chart, update: "true"}
        setChartData(chart)
        console.log(charts.find(item => item["id"] == chartSelected))
        console.log(chart)
        if (chart['ticker'] != undefined) {
            setChartType(charts.find(item => item["id"] == chartSelected)["chart_type"])
        }
        

    }


    const updateChart = async () => {
        const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + chartSelected, chartData, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })
        console.log(res)
        navigate('/charts')
    }

    const deleteChart = async () => {
        const res = await axios.delete('http://localhost:4004/chart/CustomCharts/' + chartSelected)
        console.log(res)
        navigate('/charts')
    }

    const updaterFunction = (values) =>{
        setChartData(values)
    }

    return (
        <>
            <FormControl fullWidth>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(event) => setChartSelected(event.target.value)}
                    variant="filled"
                >
                    {charts.map(item =>
                        <MenuItem value={item.id}>{item.title}</MenuItem>
                    )}
                </Select>
            </FormControl>

            <Button onClick={updateChart}>
                Update Chart
            </Button>
            <Button onClick={deleteChart}>
                Delete Chart
            </Button>

            {chartType == "simple"
                ? <MyChartSettings args={chartData} updaterFunction = {updaterFunction} />
                : <> </>}

            {chartType == "complex"
                ? <MyChart2Settings args={chartData} updaterFunction = {updaterFunction}  />
                : <> </>}
        </>
    );
}

export default ChartModifier;