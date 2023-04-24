import React, { useState, useEffect } from "react";
import { MyChart } from "./MyChart";
import { Button, FormControl, Input, InputLabel, MenuItem, TextField, Select } from "@mui/material";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import {   SwipeableDrawer, Switch,  FormControlLabel } from "@mui/material";
import FormGroup from '@mui/material/FormGroup'


export default function MyChartSettings(args) {

    const [displayValues, setDisplayValues] = useState({})
    const [ticker, setTicker] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [label, setLabel] = useState();
    const [title, setTitle] = useState();
    const [field, setField] = useState();
    const [toggle_05, setToggle_05] = useState();
    const [toggle_075, setToggle_075] = useState();
    const [toggle_09, setToggle_09] = useState();
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
            toggle_05: `${toggle_05}`,
            toggle_075: `${toggle_075}`,
            toggle_09: `${toggle_09}`,
            chart_type : "simple"

        });
    }, [ticker, startDate, endDate, label, title, field, toggle_05, toggle_075, toggle_09]);


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
            <FormGroup>
                <FormControlLabel control={<Switch />} label="Toggle forecast 05" onChange={(event) => setToggle_05(event.target.checked)} />
            </FormGroup>
            <FormGroup>
                <FormControlLabel control={<Switch />} label="Toggle forecast 075" onChange={(event) => setToggle_075(event.target.checked)} />
            </FormGroup>
            <FormGroup>
                <FormControlLabel control={<Switch />} label="Toggle forecast 09" onChange={(event) => setToggle_09(event.target.checked)} />
            </FormGroup>
            {chartToggle === true
                ? <MyChart args={displayValues} />
                : <> </>
            }
            <Button disabled>
                Add Chart
            </Button>
        </>
    );
}