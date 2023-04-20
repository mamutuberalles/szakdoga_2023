import React, { useState, useEffect } from "react";
import { MyChart } from "./MyChart";
import { Button, FormControl, Input, InputLabel, MenuItem, TextField, Select } from "@mui/material";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

export default function MyChartSettings(args) {

    const [displayValues, setDisplayValues] = useState({})
    const [ticker, setTicker] = useState("");
    const [type, setType] = useState("");
    const [label, setLabel] = useState("");
    const [chartToggle, setChartToggle] = useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleTickerChange = (event) => {
        console.log("[DEBUG]: handleTickerChange.event.target.value : " + event.target.value);
        setDisplayValues({
            ticker: event.target.value,
            type: `${type}`,
            label: `${label}`,            
            timestamp_start : `${startDate}`,
            timestamp_end : `${endDate}`
        });
        setTicker(event.target.value);
    }

    const handleTypeChange = (event) => {
        console.log("[DEBUG]: handleTypeChange.event.target.value : " + event.target.value);
        setDisplayValues({
            ticker: `${ticker}`,
            type: event.target.value,
            label: `${label}`,            
            timestamp_start : `${startDate}`,
            timestamp_end : `${endDate}`
        });
        setType(event.target.value);
    }

    const handleLabelChange = (event) => {
        console.log("[DEBUG]: handleLabelChange.event.target.value : " + event.target.value);
        setDisplayValues({
            ticker: `${ticker}`,
            type: `${type}`,
            label: event.target.value,            
            timestamp_start : `${startDate}`,
            timestamp_end : `${endDate}`
        });
        setLabel(event.target.value);
    }

    const handleStartDateChange = (event) => {
        console.log("[DEBUG]: handleStartDateChange.event.target.value : " + event);
/*         setDisplayValues({
            ticker: `${ticker}`,
            type: `${type}`,
            label: `${label}`,  
            timestamp_start : moment(event).format(
                'YYYY-MM-DD'
            ),
            timestamp_end : `${endDate}`
        });
        setStartDate(moment(event).format(
            'YYYY-MM-DD'
        ));  */
    }

    const handleEndDateChange = (event) => {
/*         console.log("[DEBUG]: handleEndDateChange.event.target.value : " + event);
        setDisplayValues({
            ticker: `${ticker}`,
            type: `${type}`,
            label: `${label}`,  
            timestamp_start : `${startDate}`,
            timestamp_end : moment(event).format(
                'YYYY-MM-DD'
            )
        });
        setEndDate(moment(event).format(
            'YYYY-MM-DD'
        )); */
    }

    const toggle = (event) => {
        if (chartToggle) {
            setChartToggle(false);
        }
        else {
            setChartToggle(true);
            console.log(displayValues)
        }
    }

    useEffect( () =>{
        setDisplayValues({
            ticker: `${ticker}`,
            type: `${type}`,
            label: `${label}`,            
            timestamp_start : `${moment(startDate).format("YYYY-MM-DD")}`,
            timestamp_end : `${moment(endDate).format("YYYY-MM-DD")}`
        });
    }, [startDate,endDate] );

    const addChart = async () => {
        const res = await axios.post('http://localhost:4004/chart/Chart', {
            id: 99,
            ticker: `${ticker}`,
            type : `${type}`,
            label : `${label}`
        },
        {
                headers: {
                    /* 'Authorization' : 'Basic admin', */
                    /* 'Content-type' : 'application/json;IEEE754Compatible=true' */
                }
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
                console.log(error);
        });
    }

    return (
        <>

            <FormControl variant="filled">
                <InputLabel>
                    Ticker
                </InputLabel>
                <Select value={ticker}
                    onChange={handleTickerChange}>
                    <MenuItem value={"BTC"}>
                        BTC
                    </MenuItem>
                    <MenuItem value={"ETH"}>
                        ETH
                    </MenuItem>
                    <MenuItem value={"XMR"}>
                        XMR
                    </MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="filled">
                <InputLabel>
                    Type
                </InputLabel>
                <Select value={type}
                    onChange={handleTypeChange}>
                    <MenuItem value={"open"}>
                        Open
                    </MenuItem>
                    <MenuItem value={"close"}>
                        Close
                    </MenuItem>
                    <MenuItem value={"high"}>
                        High
                    </MenuItem>
                    <MenuItem value={"low"}>
                        Low
                    </MenuItem>
                    <MenuItem value={"volume"}>
                        Volume
                    </MenuItem>
                    <MenuItem value={"adj_close"}>
                        Adjusted Close
                    </MenuItem>
                </Select>
            </FormControl>
            <TextField label="Label" defaultValue={args.args.label} variant="filled" onChange={handleLabelChange}>
            </TextField>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date) } dateFormat="yyyy/MM/dd" />
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy/MM/dd" />
            <Button onClick={toggle}>
                Preview Chart
            </Button>
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