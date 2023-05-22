import React, { useState, useEffect } from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import moment from 'moment';
import DatePicker from "react-datepicker";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Button, Card, FlexBox, Title, Text } from "@ui5/webcomponents-react";
import MyChart2Update from "./MyChart2Update";

export function MyChart2Settings({ args, updaterFunction }, update) {

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

    const toggle = () => {
        if (chartToggle) {
            setChartToggle(false);
        }
        else {
            setChartToggle(true);
        }
    }


    const addChart = async () => {
        await axios.post('http://localhost:4004/chart/CustomCharts', displayValues, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })
        navigate('/charts');
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

        let start_date = moment(startDate).format("YYYY-MM-DD")
        if(start_date == "Invalid date") {
            start_date = "2018-04-19"
        }

        let end_date = moment(endDate).format("YYYY-MM-DD")
        if(end_date == "Invalid date") {
            end_date = "9999-12-31"
        }
        setDisplayValues({
            ticker: `${ticker}`,
            field: `${field}`,
            label: `${label}`,
            start_date: `${start_date}`,
            end_date: `${end_date}`,
            title: `${title}`,
            ticker2: `${ticker2}`,
            label2: `${label2}`,
            field2: `${field2}`,
            chart_type: "complex",
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
            ticker2: `${ticker2}`,
            label2: `${label2}`,
            field2: `${field2}`,
            chart_type: "complex",
            bookmarked: "false",
            hidden: "false"

        })
        setChartToggle(false);
    }, [ticker, startDate, endDate, label, title, field, ticker2, label2, field2]);

    return (
        <>
            <Card>
                <FlexBox alignItems="Center" justifyContent="SpaceAround">
                    <Title>Axis 1 Settings: </Title>
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
                    <TextField label="Label" variant="outlined" onChange={(event) => setLabel(event.target.value)} defaultValue={args.label} />
                </FlexBox>
                <FlexBox alignItems="Center" justifyContent="SpaceAround">
                    <Title>Axis 2 Settings: </Title>
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel>Second Ticker</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(event) => setTicker2(event.target.value)}
                            label="Second Ticker"
                            defaultValue={args.ticker2}
                        >
                            {tickers.map(item =>
                                <MenuItem value={item.ticker}>{item.ticker}</MenuItem>
                            )}

                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel>Second Field</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(event) => setField2(event.target.value)}
                            label="Second Field"
                            defaultValue={args.field2}
                        >
                            <MenuItem value="open">Open</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="close">Close</MenuItem>
                            {/* <MenuItem value="adj_close">Adjusted Close</MenuItem> */}
                            <MenuItem value="volume">Volume</MenuItem>

                        </Select>
                    </FormControl>
                    <TextField label="Second Label" variant="outlined" onChange={(event) => setLabel2(event.target.value)} defaultValue={args.label2} />
                </FlexBox>
                <FlexBox alignItems="Center" justifyContent="SpaceAround">
                    <Text >Start date</Text>
                    <DatePicker selected={startDate === undefined && args.start_date !== undefined ? new Date(args.start_date) : startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy/MM/dd" />
                    <Text >End date</Text>
                    <DatePicker selected={endDate === undefined && args.end_date !== undefined ? new Date(args.end_date) : endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy/MM/dd" />
                </FlexBox>
                <FlexBox alignItems="Center" justifyContent="SpaceAround">
                    <TextField label="Chart Title" variant="outlined" onChange={(event) => setTitle(event.target.value)} defaultValue={args.title} />
                    <Button onClick={toggle}>
                        Preview Chart
                    </Button>
                    <Button onClick={addChart}>
                        Add Chart
                    </Button>
                </FlexBox>
            </Card>







            {chartToggle === true
                ? <MyChart2Update args={displayValues} />
                : <> </>
            }


        </>
    );
}
export default MyChart2Settings;