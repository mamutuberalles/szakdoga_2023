import React, { useState, useEffect } from "react";
import MyChart2 from "./MyChart2";
import { Card } from "@ui5/webcomponents-react";
import { Button, Input, SwipeableDrawer, Switch, TextField, FormControlLabel } from "@mui/material";
import FormGroup from '@mui/material/FormGroup';
import moment from 'moment';
import DatePicker from "react-datepicker";
import axios from 'axios';

export function MyChart2Settings(args) {



    const [displayValues, setDisplayValues] = useState({})
    const [ticker, setTicker] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [label, setLabel] = useState("");
    const [title, setTitle] = useState("");
    const [field, setField] = useState("");
    const [ticker2, setTicker2] = useState("");
    const [label2, setLabel2] = useState("");
    const [field2, setField2] = useState("");
    const [chartToggle, setChartToggle] = useState();

    const toggle = () => {
        if (chartToggle) {
            setChartToggle(false);
        }
        else {
            setChartToggle(true);
            console.log(displayValues)
        }
    }


    const addChart = async () => {
        const res = await axios.post('http://localhost:4004/chart/CustomCharts', displayValues, {
            headers : {
                "Authorization" : "Basic admin",
                "Content-Type" : "application/json;IEEE754Compatible=true"
            }
        })
        console.log(res)
    }

    useEffect(() => {
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
            chart_type: "complex"

        });
    }, [ticker, startDate, endDate, label, title, field, ticker2, label2, field2]);

    return (
        <>

            <TextField label="Ticker" variant="filled" onChange={(event) => setTicker(event.target.value)} />
            <TextField label="Type" variant="filled" onChange={(event) => setField(event.target.value)} />
            <TextField label="Label" variant="filled" onChange={(event) => setLabel(event.target.value)} />

            <TextField label="Second Ticker" variant="filled" onChange={(event) => setTicker2(event.target.value)} />
            <TextField label="Second Type" variant="filled" onChange={(event) => setField2(event.target.value)} />
            <TextField label="Second Label" variant="filled" onChange={(event) => setLabel2(event.target.value)} />


            <Button onClick={toggle}>
                Preview Chart
            </Button>

            <Button onClick={addChart}>
                Add Chart
            </Button>
            <TextField label="Chart Title" variant="filled" onChange={(event) => setTitle(event.target.value)}>

            </TextField>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy/MM/dd" />
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy/MM/dd" />

            {chartToggle === true
                ? <MyChart2 args={displayValues} />
                : <> </>
            }


        </>
    );
}
export default MyChart2Settings;