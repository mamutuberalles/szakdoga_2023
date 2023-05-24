import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button, Card } from "@ui5/webcomponents-react";
import { FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel } from "@mui/material"
import { Title, FlexBox } from '@ui5/webcomponents-react';
import ChartList from "../Basic Components/ChartList";
import { Checkbox } from "@mui/material";

export function Charts() {

    const [fetchedCharts, setFetchedCharts] = useState([]);
    const [orderField, setOrderField] = useState("ticker")
    const [direction, setDirection] = useState("asc")
    const [chartToggle, setChartToggle] = useState(true);
    const [bookmarksFirst, setBookmarksFirst] = useState(true);
    const [initial, setInitial] = useState(0)

    const fetchChart = async () => {
        const res = await axios.get('http://localhost:4004/chart/CustomCharts?$filter=hidden eq \'false\'')

        let data = res.data.value;

        data = data.filter(item => item.hidden === "false")

        let favorites = data.filter(item => item.bookmarked === "true")

        let charts;

        if (bookmarksFirst === true) {
            data = data.filter(item => item.bookmarked === "false")
            if (orderField !== undefined) {
                data.sort((a, b) => {

                    if (orderField !== "start_date" && orderField !== "end_date") {
                        return a[orderField].localeCompare(b[orderField])
                    }
                    else {
                        if (a[orderField] < b[orderField]) {
                            return -1;
                        }


                        if (a[orderField] > b[orderField]) {
                            return 1;
                        }


                        return 0;
                    }


                })
                favorites.sort((a, b) => {

                    if (orderField !== "start_date" && orderField !== "end_date") {
                        return a[orderField].localeCompare(b[orderField])
                    }
                    else {
                        if (a[orderField] < b[orderField]) {
                            return -1;
                        }


                        if (a[orderField] > b[orderField]) {
                            return 1;
                        }


                        return 0;
                    }


                })
            }
            if (direction === "desc") {
                favorites.reverse();
                data.reverse();
            }
            charts = favorites.concat(data)
        }
        else {
            if (orderField !== undefined) {
                data.sort((a, b) => {

                    if (orderField !== "start_date" && orderField !== "end_date") {
                        return a[orderField].localeCompare(b[orderField])
                    }
                    else {
                        if (a[orderField] < b[orderField]) {
                            return -1;
                        }


                        if (a[orderField] > b[orderField]) {
                            return 1;
                        }


                        return 0;
                    }

                })
            }

            charts = data
            if (direction === "desc") {
                charts.reverse();
            }
        }

        setFetchedCharts(charts)
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
        if (initial === 0) {
            setChartToggle(true);
            setInitial(1)
        }
        else {
            setChartToggle(false);
        }

    }, [orderField, direction, bookmarksFirst])



    return (
        <>
            <Card>
                <FlexBox alignItems="Center" justifyContent="SpaceAround">
                    <Title > Sort your charts: </Title>
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel>Order by</InputLabel>
                        <Select
                            autoWidth 
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(event) => setOrderField(event.target.value)}
                            label="Order by"
                            defaultValue={"ticker"}
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
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }   }>
                        <InputLabel>Direction</InputLabel>
                        <Select
                            autoWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(event) => setDirection(event.target.value)}
                            label="Direction"
                            defaultValue={"asc"}
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Bookmarked Charts First" onClick={(event) => setBookmarksFirst(event.target.checked)} />
                    </FormGroup>
                    <Button onClick={toggle}>
                        Show Charts
                    </Button>
                </FlexBox>
            </Card>


            <div>
                {chartToggle === true
                    ? <ChartList charts={fetchedCharts} />
                    : <> </>}
            </div>




        </>
    );
}

export default Charts;