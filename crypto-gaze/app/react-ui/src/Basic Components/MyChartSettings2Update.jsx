import React, { useState, useEffect } from "react";
import MyChart2 from "./MyChart2";
import { Card } from "@ui5/webcomponents-react";
import { Button, Input, SwipeableDrawer, Switch, TextField, FormControlLabel, FormControl, InputLabel, Select, MenuItem, Checkbox  } from "@mui/material";
import FormGroup from '@mui/material/FormGroup';
import moment from 'moment';
import DatePicker from "react-datepicker";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export function MyChart2SettingsUpdate({ args, updaterFunction }) {

    const navigate = useNavigate();

    const [tickers, setTickers] = useState([])
    const [tickersFetched, setTickersFetched] = useState(0)
    const [displayValues, setDisplayValues] = useState({})
    const [ticker, setTicker] = useState(args.ticker);
    const [startDate, setStartDate] = useState(args.start_date != null ? new Date(args.start_date) : new Date());
    const [endDate, setEndDate] = useState(args.end_date != null ? new Date(args.end_date) : new Date());
    const [label, setLabel] = useState(args.label);
    const [title, setTitle] = useState(args.title);
    const [field, setField] = useState(args.field);
    const [ticker2, setTicker2] = useState(args.ticker2);
    const [label2, setLabel2] = useState(args.label2);
    const [field2, setField2] = useState(args.field2);
    const [chartToggle, setChartToggle] = useState();

    const [bookmarked, setBookmarked] = useState(args.bookmarked)
    const [hidden, setHidden] = useState(args.hidden)

    const toggle = () => {
        if (chartToggle) {
            setChartToggle(false);
        }
        else {
            setChartToggle(true);
        }
    }




    const fetchTickers = async () => {
        const res = await axios.get('http://localhost:4004/catalog/Crypto?$apply=groupby((ticker))')
        setTickers(res.data.value)
        setTickersFetched(fetchTickers + 1)
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
            ticker2: `${ticker2}`,
            label2: `${label2}`,
            field2: `${field2}`,
            chart_type: "complex",
            bookmarked : `${bookmarked}`,
            hidden : `${hidden}`

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
            ticker2: `${ticker2}`,
            label2: `${label2}`,
            field2: `${field2}`,
            chart_type: "complex",
            bookmarked : `${bookmarked}`,
            hidden : `${hidden}`
        })
        setChartToggle(false);
    }, [ticker, startDate, endDate, label, title, field, ticker2, label2, field2, bookmarked, hidden]);

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
            <TextField label="Label" variant="filled" onChange={(event) => setLabel(event.target.value)} defaultValue={args.label} />

            <FormControl variant="filled">
                <InputLabel>Second Ticker</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(event) => setTicker2(event.target.value)}
                    variant="filled"
                    label="Ticker2"
                    defaultValue={args.ticker2}
                >
                    {tickers.map(item =>
                        <MenuItem value={item.ticker}>{item.ticker}</MenuItem>
                    )}

                </Select>
            </FormControl>
            <FormControl variant="filled">
                <InputLabel>Second Field</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(event) => setField2(event.target.value)}
                    variant="filled"
                    label="Field2"
                    defaultValue={args.field2}
                >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="close">Close</MenuItem>
                    <MenuItem value="adj_close">Adjusted Close</MenuItem>
                    <MenuItem value="volume">Volume</MenuItem>

                </Select>
            </FormControl>
            <TextField label="Second Label" variant="filled" onChange={(event) => setLabel2(event.target.value)} defaultValue={args.label2} />


            <Button onClick={toggle}>
                Preview Chart
            </Button>
            <TextField label="Chart Title" variant="filled" onChange={(event) => setTitle(event.target.value)} defaultValue={args.title} />


            <DatePicker selected={startDate == undefined && args.start_date != undefined ? new Date(args.start_date) : startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy/MM/dd" />
            <DatePicker selected={endDate == undefined && args.end_date != undefined ? new Date(args.end_date) : endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy/MM/dd" />

            <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked={args.hidden == "true"} />} label="Hidden" onClick={(event) => setHidden(event.target.checked)}  />
                <FormControlLabel control={<Checkbox defaultChecked={args.bookmarked == "true"} />} label="Bookmarked"  onClick={(event) => setBookmarked(event.target.checked)} />
            </FormGroup>


            {chartToggle === true
                ? <MyChart2 args={displayValues} />
                : <> </>
            }


        </>
    );
}
export default MyChart2SettingsUpdate;