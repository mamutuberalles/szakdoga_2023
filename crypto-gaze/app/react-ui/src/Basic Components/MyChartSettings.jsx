import React, { useState, useEffect } from "react";
import { MyChart } from "./MyChart";
import { Button, FormControl, Input, InputLabel, MenuItem, TextField, Select } from "@mui/material";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { SwipeableDrawer, Switch, FormControlLabel, FormLabel, RadioGroup, Radio } from "@mui/material";
import FormGroup from '@mui/material/FormGroup'
import { useNavigate } from "react-router-dom";


export default function MyChartSettings({ args, updaterFunction }) {

    const [displayValues, setDisplayValues] = useState({})
    const [ticker, setTicker] = useState(args.ticker);
    const [startDate, setStartDate] = useState(args.start_date != null ? new Date(args.start_date) : new Date()); //new Date(args.start_date)
    const [endDate, setEndDate] = useState(args.end_date != null ? new Date(args.end_date) : new Date());
    const [label, setLabel] = useState(args.label);
    const [title, setTitle] = useState(args.title);
    const [field, setField] = useState(args.field);
    const [forecast, setForecast] = useState(args.forecast)
    const [chartToggle, setChartToggle] = useState();

    const navigate = useNavigate();

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

        if (args.start_date == null) {
            args.start_date = new Date('2018-04-19')
        }

        if (args.end_date == null) {
            console.log(args.end_date)
            args.end_date = new Date('9999-12-31')
        }

        updaterFunction({
            ticker: `${ticker}`,
            field: `${field}`,
            label: `${label}`,
            start_date: `${moment(startDate).format("YYYY-MM-DD")}`,
            end_date: `${moment(endDate).format("YYYY-MM-DD")}`,
            title: `${title}`,
            forecast: `${forecast}`,
            chart_type: "simple"
        })

        console.log(args.update === "true")
        console.log(args.update == true)
        console.log(typeof(args.update))
    }, [ticker, startDate, endDate, label, title, field, forecast]);


    const addChart = async () => {
        const res = await axios.post('http://localhost:4004/chart/CustomCharts', displayValues, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })
        console.log(res)
        navigate('/charts')
    }


    return (
        <>
            <TextField label="Ticker" variant="filled" onChange={(event) => setTicker(event.target.value)} defaultValue={args.ticker} />
            <TextField label="Title" variant="filled" onChange={(event) => setTitle(event.target.value)} defaultValue={args.title} />
            <TextField label="Field" variant="filled" onChange={(event) => setField(event.target.value)} defaultValue={args.field} />
            <TextField label="Label" variant="filled" onChange={(event) => setLabel(event.target.value)} defaultValue={args.label} />
            <DatePicker selected={startDate == undefined && args.start_date != undefined ? new Date(args.start_date) : startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy/MM/dd" />
            <DatePicker selected={endDate == undefined && args.end_date != undefined ? new Date(args.end_date) : endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy/MM/dd" />
            <Button onClick={toggle}>
                Preview Chart
            </Button>
            <FormControl>
                <FormLabel id="radio-buttons-group-label">Forecast</FormLabel>
                <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    defaultValue={args.forecast}
                    name="radio-buttons-group"
                    onChange={(event) => setForecast(event.target.value)}
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
            {args.update === "true" ? <> </> :
                <Button onClick={addChart}>
                    Add Chart
                </Button>
            }
        </>
    );
}