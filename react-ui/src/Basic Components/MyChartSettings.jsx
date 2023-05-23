import React, { useState, useEffect } from "react";
import { FormControl,  InputLabel, MenuItem, TextField, Select } from "@mui/material";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { FormControlLabel, FormLabel, RadioGroup, Radio } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button, Card, FlexBox, Title, Text } from "@ui5/webcomponents-react";
import { MyChartUpdate } from "./MyChartUpdate";


export default function MyChartSettings({ args, updaterFunction }) {

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

        let start_date = moment(startDate).format("YYYY-MM-DD")
        if(start_date == "Invalid date") {
            start_date = "2018-04-19"
        }

        let end_date = moment(endDate).format("YYYY-MM-DD")
        if(end_date == "Invalid date") {
            end_date = "9999-12-31"
        }

        if (tickersFetched < 1) {
            fetchTickers()
        }

        setDisplayValues({
            ticker: `${ticker}`,
            field: `${field}`,
            label: `${label}`,
            start_date: `${start_date}`,
            end_date: `${end_date}`,
            title: `${title}`,
            forecast: `${forecast}`,
            chart_type: "simple",
            bookmarked: "false",
            hidden: "false"

        });

        if (args.start_date === null) {
            args.start_date = new Date('2018-04-19')
        }

        if (args.end_date === null) {
            console.log(args.end_date)
            args.end_date = new Date('9999-12-31')
        }

        updaterFunction({
            ticker: `${ticker}`,
            field: `${field}`,
            label: `${label}`,
            start_date: `${start_date}`,
            end_date: `${end_date}`,
            title: `${title}`,
            forecast: `${forecast}`,
            chart_type: "simple",
            bookmarked: "false",
            hidden: "false"
        })

        setChartToggle(false);
    }, [ticker, startDate, endDate, label, title, field, forecast]);

    const fetchTickers = async () => {
        const res = await axios.get('http://localhost:4004/crypto/Crypto?$apply=groupby((ticker))')
        setTickers(res.data.value)
        setTickersFetched(fetchTickers + 1)
    }

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
            <Card>
                <FlexBox  alignItems="Center" justifyContent="SpaceAround">
                    <Title>Chart Settings: </Title>
                    <TextField label="Title" variant="outlined" onChange={(event) => setTitle(event.target.value)} defaultValue={args.title} sx={{ m: 1, minWidth: 200 }} />
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel>Ticker</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(event) => setTicker(event.target.value)}
                            label="Ticker"
                            defaultValue={args.ticker}
                        >
                            {tickers.map(item =>
                                <MenuItem value={item.ticker}>{item.ticker}</MenuItem>
                            )}

                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel>Field</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(event) => setField(event.target.value)}
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

                    <TextField label="Label" variant="outlined" onChange={(event) => setLabel(event.target.value)} defaultValue={args.label} sx={{ m: 1, minWidth: 200 }} />
                </FlexBox >
                <FlexBox >
                    <Text >Start date</Text>
                    <DatePicker selected={startDate === undefined && args.start_date !== undefined ? new Date(args.start_date) : startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy/MM/dd" />
                    <Text >End date</Text>
                    <DatePicker selected={endDate === undefined && args.end_date !== undefined ? new Date(args.end_date) : endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy/MM/dd" />
                </FlexBox>
                <FlexBox wrap="Wrap" alignItems="Center" justifyContent="SpaceAround">
                    <FormControl>
                        <FormLabel id="radio-buttons-group-label">Forecast</FormLabel>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group-label"
                            defaultValue={args.forecast === undefined ? "None" : args.forecast}
                            name="radio-buttons-group"
                            onChange={(event) => setForecast(event.target.value)}
                            row
                        >
                            <FormControlLabel value="None" control={<Radio />} label="None" />
                            <FormControlLabel value="forecast_05" control={<Radio />} label="Forecast with 50% of the data" />
                            <FormControlLabel value="forecast_075" control={<Radio />} label="Forecast with 25% of the data" />
                            <FormControlLabel value="forecast_09" control={<Radio />} label="Forecast with 10% of the data" />
                        </RadioGroup>
                    </FormControl>
                    <Button onClick={toggle}>
                        Preview Chart
                    </Button>

                    <Button onClick={addChart}>
                        Add Chart
                    </Button>
                </FlexBox>
            </Card>


            {chartToggle === true
                ? <MyChartUpdate args={displayValues} />
                : <> </>
            }

        </>
    );
}