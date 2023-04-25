import React, { useState, useEffect } from "react";
import { MyChart } from "./MyChart";
import { Button, FormControl, Input, InputLabel, MenuItem, TextField, Select } from "@mui/material";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { SwipeableDrawer, Switch, FormControlLabel, FormLabel,RadioGroup,Radio } from "@mui/material";
import FormGroup from '@mui/material/FormGroup'


export default function MyChartSettings(args) {

    const [displayValues, setDisplayValues] = useState({})
    const [ticker, setTicker] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [label, setLabel] = useState();
    const [title, setTitle] = useState();
    const [field, setField] = useState();
    const [forecast, setForecast] = useState("")
    const [chartToggle, setChartToggle] = useState();

    const toggle = () => {
        if (chartToggle) {
            setChartToggle(false);
        }
        else {
            setChartToggle(true);
        }
    }

    useEffect(() => {
        setDisplayValues({
            ticker: `${ticker}`,
            field: `${field}`,
            label: `${label}`,
            start_date: `${moment(startDate).format("YYYY-MM-DD")}`,
            end_date: `${moment(endDate).format("YYYY-MM-DD")}`,
            title: `${title}`,
            forecast: `${forecast}`,
            chart_type: "simple"

        });
    }, [ticker, startDate, endDate, label, title, field, forecast]);


    const addChart = async () => {
        const res = await axios.post('http://localhost:4004/chart/CustomCharts', displayValues)
        console.log(res)
    }


    return (
        <>
            <TextField label="Ticker" variant="filled" onChange={(event) => setTicker(event.target.value)} />
            <TextField label="Title" variant="filled" onChange={(event) => setTitle(event.target.value)} />
            <TextField label="Field" variant="filled" onChange={(event) => setField(event.target.value)} />
            <TextField label="Label" variant="filled" onChange={(event) => setLabel(event.target.value)} />
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy/MM/dd" />
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy/MM/dd" />
            <Button onClick={toggle}>
                Preview Chart
            </Button>
            <FormControl>
                <FormLabel id="radio-buttons-group-label">Forecast</FormLabel>
                <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    defaultValue="None"
                    name="radio-buttons-group"
                    onChange={(event) => setForecast(event.target.value) }
                >
                    <FormControlLabel value="None" control={<Radio />} label="None" />
                    <FormControlLabel value="forecast_05" control={<Radio />} label="Forecast with 50% of the data" />
                    <FormControlLabel value="forecast_075" control={<Radio />} label="Forecast with 25% of the data" />
                    <FormControlLabel value="forecast_09" control={<Radio />} label="Forecast with 10% of the data" />
                </RadioGroup>
            </FormControl>
            {chartToggle === true
                ? <MyChart args={displayValues} />
                : <> </>
            }
            <Button onClick={addChart}>
                Add Chart
            </Button>
        </>
    );
}