import React, { useState, useEffect } from "react";
import { MyChart } from "./MyChart";
import { Button, FormControl, Input, InputLabel, MenuItem, TextField, Select, Menu } from "@mui/material";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { SwipeableDrawer, Switch, FormControlLabel, FormLabel, RadioGroup, Radio, Checkbox } from "@mui/material";
import FormGroup from '@mui/material/FormGroup'
import { useNavigate } from "react-router-dom";


export default function MyChartSettingsUpdate({ args, updaterFunction }) {

    const [tickers, setTickers] = useState([])
    const [tickersFetched, setTickersFetched] = useState(0)
    const [displayValues, setDisplayValues] = useState({})
    const [ticker, setTicker] = useState(args.ticker);
    const [startDate, setStartDate] = useState(args.start_date != null ? new Date(args.start_date) : new Date()); //new Date(args.start_date)
    const [endDate, setEndDate] = useState(args.end_date != null ? new Date(args.end_date) : new Date());
    const [label, setLabel] = useState(args.label);
    const [title, setTitle] = useState(args.title);
    const [field, setField] = useState(args.field);
    const [forecast, setForecast] = useState(args.forecast)
    const [chartToggle, setChartToggle] = useState();

    const [bookmarked, setBookmarked] = useState(args.bookmarked)
    const [hidden, setHidden] = useState(args.hidden)

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

        if (tickersFetched < 1) {
            fetchTickers()
        }

        setDisplayValues({
            ticker: `${ticker}`,
            field: `${field}`,
            label: `${label}`,
            start_date: `${moment(startDate).format("YYYY-MM-DD")}`,
            end_date: `${moment(endDate).format("YYYY-MM-DD")}`,
            title: `${title}`,
            forecast: `${forecast}`,
            chart_type: "simple",
            bookmarked: `${bookmarked}`,
            hidden: `${hidden}`

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
            chart_type: "simple",
            bookmarked: `${bookmarked}`,
            hidden: `${hidden}`
        })

        setChartToggle(false);
    }, [ticker, startDate, endDate, label, title, field, forecast,bookmarked,hidden]);

    const fetchTickers = async () => {
        const res = await axios.get('http://localhost:4004/catalog/Crypto?$apply=groupby((ticker))')
        setTickers(res.data.value)
        setTickersFetched(fetchTickers + 1)
    }


    return (
        <>
            <FormControl variant="filled">
                <InputLabel>Ticker</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(event) => setTicker(event.target.value)}
                    variant="filled"
                    label="Ticker"
                    defaultValue={args.ticker}
                >
                    {tickers.map(item =>
                        <MenuItem value={item.ticker}>{item.ticker}</MenuItem>
                    )}

                </Select>
            </FormControl>
            <FormControl variant="filled">
                <InputLabel>Field</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(event) => setField(event.target.value)}
                    variant="filled"
                    label="Field"
                    defaultValue={args.field}
                >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="close">Close</MenuItem>
                    <MenuItem value="adj_close">Adjusted Close</MenuItem>
                    <MenuItem value="volume">Volume</MenuItem>

                </Select>
            </FormControl>
            <TextField label="Title" variant="filled" onChange={(event) => setTitle(event.target.value)} defaultValue={args.title} />
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
                    defaultValue={args.forecast == undefined ? "None" : args.forecast}
                    name="radio-buttons-group"
                    onChange={(event) => setForecast(event.target.value)}
                >
                    <FormControlLabel value="None" control={<Radio />} label="None" />
                    <FormControlLabel value="forecast_05" control={<Radio />} label="Forecast with 50% of the data" />
                    <FormControlLabel value="forecast_075" control={<Radio />} label="Forecast with 25% of the data" />
                    <FormControlLabel value="forecast_09" control={<Radio />} label="Forecast with 10% of the data" />
                </RadioGroup>
            </FormControl>


            <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked={args.hidden == "true"} />} label="Hidden" onClick={(event) => setHidden(event.target.checked)}  />
                <FormControlLabel control={<Checkbox defaultChecked={args.bookmarked == "true"} />} label="Bookmarked"  onClick={(event) => setBookmarked(event.target.checked)} />
            </FormGroup>

            {chartToggle === true
                ? <MyChart args={displayValues} />
                : <> </>
            }
        </>
    );
}