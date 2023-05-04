import React, { useState, useEffect } from "react";
import axios from 'axios';
import { MyChart } from "../Basic Components/MyChart";
import { MyChartSettings } from "../Basic Components/MyChartSettings";
import { Button } from "@ui5/webcomponents-react";
import MyChart2 from "../Basic Components/MyChart2";
import { FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel } from "@mui/material"
import { Title } from '@ui5/webcomponents-react';
import ChartList from "../Basic Components/ChartList";
import { Checkbox } from "@mui/material";

export function Charts() {

    const [fetchedCharts, setFetchedCharts] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);

    const [orderField, setOrderField] = useState("")
    const [direction, setDirection] = useState("asc")
    const [chartToggle, setChartToggle] = useState();

    const [bookmarksFirst, setBookmarksFirst] = useState(true);

    const fetchChart = async () => {
        const res = await axios.get('http://localhost:4004/chart/CustomCharts?$filter=hidden eq ' + "'false'")

        let data = res.data.value;

        data = data.filter(item => item.hidden == "false")

        let favorites = data.filter(item => item.bookmarked == "true")

        

        let charts;

        if (bookmarksFirst == true) {
            data = data.filter(item => item.bookmarked == "false")
            if (orderField != undefined) {
                console.log("[DEBUG] : Ordering with favs")
                data.sort((a, b) => {

                    if (orderField != "start_date" && orderField != "end_date") {
                        return a[orderField].localeCompare(b[orderField])
                    }
                    else {
                        if (a[orderField] < b[orderField]) {
                            console.log("[DEBUG] : " + a[orderField] + " < " + b[orderField])
                            return -1;
                        }


                        if (a[orderField] > b[orderField]) {
                            console.log("[DEBUG] : " + a[orderField] + " > " + b[orderField])
                            return 1;
                        }


                        return 0;
                    }


                })
                favorites.sort((a, b) => {

                    if (orderField != "start_date" && orderField != "end_date") {
                        return a[orderField].localeCompare(b[orderField])
                    }
                    else {
                        if (a[orderField] < b[orderField]) {
                            console.log("[DEBUG] : " + a[orderField] + " < " + b[orderField])
                            return -1;
                        }


                        if (a[orderField] > b[orderField]) {
                            console.log("[DEBUG] : " + a[orderField] + " > " + b[orderField])
                            return 1;
                        }


                        return 0;
                    }


                })
            }
            if(direction == "desc")
            {
                favorites.reverse();
                data.reverse();
            }
            charts = favorites.concat(data)
        }
        else {
            if (orderField != undefined) {
                console.log("[DEBUG] : Ordering without favs")
                data.sort((a, b) => {

                    if (orderField != "start_date" && orderField != "end_date") {
                        return a[orderField].localeCompare(b[orderField])
                    }
                    else {
                        if (a[orderField] < b[orderField]) {
                            console.log("[DEBUG] : " + a[orderField] + " < " + b[orderField])
                            return -1;
                        }


                        if (a[orderField] > b[orderField]) {
                            console.log("[DEBUG] : " + a[orderField] + " > " + b[orderField])
                            return 1;
                        }


                        return 0;
                    }

                })
            }

            charts = data
            if(direction == "desc")
            {
                charts.reverse();
            }
        }



        console.log("[DEBUG] bookmarksFirst:  "+bookmarksFirst)



        setFetchedCharts(charts)
        setDataFetched(dataFetched + 1)

    };


    const toggle = () => {
        if (chartToggle) {
            setChartToggle(false);
        }
        else {
            setChartToggle(true);
        }
    }

    useEffect(() => {

        fetchChart();
        setChartToggle(false);
    }, [orderField, direction, bookmarksFirst])



    return (
        <>
            <div>
                <Title> Sort your charts: </Title>
                <FormControl variant="filled">
                    <InputLabel>Order by...</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={(event) => setOrderField(event.target.value)}
                        variant="filled"
                        label="Order by..."
                    >
                        <MenuItem value="ticker">Ticker</MenuItem>
                        <MenuItem value="start_date">Start Date</MenuItem>
                        <MenuItem value="end_date">End Date</MenuItem>
                        <MenuItem value="label">Label</MenuItem>
                        <MenuItem value="title">Title</MenuItem>
                        <MenuItem value="field">Field</MenuItem>
                        <MenuItem value="chart_type">Type of Chart</MenuItem>
                        <MenuItem value="ticker2">Second axis ticker</MenuItem>
                        <MenuItem value="field2">Second axis field</MenuItem>
                        <MenuItem value="label2">Second axis label</MenuItem>
                        <MenuItem value="forecast">Forecast type</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="filled">
                    <InputLabel>Direction</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={(event) => setDirection(event.target.value)}
                        variant="filled"
                        label="Direction"
                        defaultValue={"asc"}
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>


                    </Select>
                </FormControl>
                <Button onClick={toggle}>
                    Show Charts
                </Button>
                <FormGroup>
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Bookmarked Charts First" onClick={(event) => setBookmarksFirst(event.target.checked)} />
                </FormGroup>
            </div>
            <div>
                {chartToggle === true
                    ? <ChartList charts={fetchedCharts} />
                    : <> </>}
            </div>




        </>
    );
}

export default Charts;