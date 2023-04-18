import React, { useState } from "react";
import { MyChart } from "./MyChart";
import { Button, Input, TextField } from "@mui/material";
import { Card } from '@ui5/webcomponents-react';

export default function MyChartSettings(args) {

    const [displayValues, setDisplayValues] = useState({})
    const [ticker, setTicker] = useState("");
    const [type, setType] = useState("");
    const [label, setLabel] = useState("");

    const handleTickerChange = (event) => {
        console.log("[DEBUG]: handleTickerChange.event.target.value : "+event.target.value);
        setDisplayValues({
            ticker: event.target.value,
            type: `${type}`,
            label: `${label}`
        });
        setTicker(event.target.value);
    }

    const handleTypeChange = (event) => {
        console.log("[DEBUG]: handleTypeChange.event.target.value : "+event.target.value);
        setDisplayValues({
            ticker: `${ticker}`,
            type: event.target.value,
            label: `${label}`
        });
        setType(event.target.value);
    }

    const handleLabelChange = (event) => {
        console.log("[DEBUG]: handleLabelChange.event.target.value : "+event.target.value);
        setDisplayValues({
            ticker: `${ticker}`,
            type: `${type}`,
            label: event.target.value,
        });
        setLabel(event.target.value);
    }
    return (
        <>
            <Card>
                <TextField label="Ticker" defaultValue={args.args.ticker} variant="filled" onChange={handleTickerChange}>
                </TextField>
                <TextField label="Type" defaultValue={args.args.type} variant="filled" onChange={handleTypeChange}>
                </TextField>
                <TextField label="Label" defaultValue={args.args.label} variant="filled" onChange={handleLabelChange}>
                </TextField>
                <Button>
                    Add Chart
                </Button>
                <MyChart args={displayValues}/>
            </Card>

        </>
    );
}