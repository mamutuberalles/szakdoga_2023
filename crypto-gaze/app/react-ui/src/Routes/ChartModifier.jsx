import React, { useState, useEffect } from "react";
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChartEditor from "../Basic Components/ChartEditor";
import { Button, Card, FlexBox, Title } from "@ui5/webcomponents-react";

export function ChartModifier() {

    const navigate = useNavigate();

    const [chartSelected, setChartSelected] = useState();
    const [charts, setCharts] = useState([])
    const [chartData, setChartData] = useState([])
    const [toggleEditor, setToggleEditor] = useState()

    const fetchCharts = async () => {
        const res = await axios.get('http://localhost:4004/chart/CustomCharts')
        setCharts(res.data.value)
        console.log(res)

    }

    useEffect(() => {
        if (charts.length < 1) {
            fetchCharts();
        }
        if (chartSelected !== "") {
            selectChart()
        }
        setToggleEditor(false)

    }, [chartSelected])


    const selectChart = () => {
        let chart = charts.find(item => item["id"] === chartSelected)
        setChartData(chart)
    }


    const updateChart = async () => {
        if (chartSelected !== "" && chartSelected !== "undefined" && chartSelected !== undefined) {
            await axios.patch('http://localhost:4004/chart/CustomCharts/' + chartSelected, chartData, {
                headers: {
                    "Authorization": "Basic admin",
                    "Content-Type": "application/json;IEEE754Compatible=true"
                }
            })
            navigate('/charts')
        }
    }

    const deleteChart = async () => {
        if (chartSelected !== "" && chartSelected !== "undefined" && chartSelected !== undefined) {
            await axios.delete('http://localhost:4004/chart/CustomCharts/' + chartSelected)
            navigate('/charts')
        }
    }

    const updaterFunction = (values) => {
        setChartData(values)
    }


    const toggle = () => {
        if (chartSelected !== "" && chartSelected !== "undefined" && chartSelected !== undefined) {
            if (toggleEditor) {
                setToggleEditor(false);
            }
            else {
                setToggleEditor(true);
            }
        }

    }

    return (
        <>
            <Card>
                <FlexBox alignItems="Center" justifyContent="SpaceAround">
                    <Title>Select chart: </Title>
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel>Chart title</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(event) => setChartSelected(event.target.value)}
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

                    <Button onClick={toggle}>
                        Edit Chart
                    </Button>
                </FlexBox>
            </Card>


            {toggleEditor === true
                ? <ChartEditor params={chartData} updaterFunction={updaterFunction} />
                : <> </>
            }


        </>
    );
}

export default ChartModifier;