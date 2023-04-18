import React, { useState } from "react";
import MyChart2 from "./MyChart2";
import { Card } from "@ui5/webcomponents-react";
import { Button, Input, SwipeableDrawer, Switch, TextField, FormControlLabel } from "@mui/material";
import FormGroup from '@mui/material/FormGroup';

export function MyChart2Settings(args) {

    const [displayValues, setDisplayValues] = useState({})
    const [ticker, setTicker] = useState("");
    const [type, setType] = useState("");
    const [label, setLabel] = useState("");
    const [axis2, setAxis2] = useState(false);
    const [ticker2, setTicker2] = useState("");
    const [type2, setType2] = useState("");
    const [label2, setLabel2] = useState("");

    const handleTickerChange = (event) => {
        console.log("[DEBUG]: handleTickerChange.event.target.value : " + event.target.value);
        setDisplayValues({
            ticker: event.target.value,
            type: `${type}`,
            label: `${label}`,
            axis2: `${axis2}`,
            ticker2: `${ticker2}`,
            type2: `${type2}`,
            label2: `${label2}`
        });
        setTicker(event.target.value);
    }

    const handleTypeChange = (event) => {
        console.log("[DEBUG]: handleTypeChange.event.target.value : " + event.target.value);
        setDisplayValues({
            ticker: `${ticker}`,
            type: event.target.value,
            label: `${label}`,
            axis2: `${axis2}`,
            ticker2: `${ticker2}`,
            type2: `${type2}`,
            label2: `${label2}`
        });
        setType(event.target.value);
    }

    const handleLabelChange = (event) => {
        console.log("[DEBUG]: handleLabelChange.event.target.value : " + event.target.value);
        setDisplayValues({
            ticker: `${ticker}`,
            type: `${type}`,
            label: event.target.value,
            axis2: `${axis2}`,
            ticker2: `${ticker2}`,
            type2: `${type2}`,
            label2: `${label2}`
        });
        setLabel(event.target.value);
    }

    const handleTickerChange2 = (event) => {
        console.log("[DEBUG]: handleTickerChange2.event.target.value : " + event.target.value);
        setDisplayValues({
            ticker: `${ticker}`,
            type: `${type}`,
            label: `${label}`,
            axis2: `${axis2}`,
            ticker2: event.target.value,
            type2: `${type2}`,
            label2: `${label2}`
        });
        setTicker2(event.target.value);
    }

    const handleTypeChange2 = (event) => {
        console.log("[DEBUG]: handleTypeChange2.event.target.value : " + event.target.value);
        setDisplayValues({
            ticker: `${ticker}`,
            type: `${type2}`,
            label: `${label}`,
            axis2: `${axis2}`,
            ticker2: `${ticker2}`,
            type2: event.target.value,
            label2: `${label2}`
        });
        setType2(event.target.value);
    }

    const handleLabelChange2 = (event) => {
        console.log("[DEBUG]: handleLabelChange2.event.target.value : " + event.target.value);
        setDisplayValues({
            ticker: `${ticker}`,
            type: `${type}`,
            label: `${label2}`,
            axis2: `${axis2}`,
            ticker2: `${ticker2}`,
            type2: `${type2}`,
            label2: event.target.value,
        });
        setLabel2(event.target.value);
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
            </Card>
            <Card>
                <FormGroup>
                    <FormControlLabel  control={<Switch />} label="Second Axis" />
                </FormGroup>
                <TextField label="Second Ticker" defaultValue={args.args.ticker2} variant="filled" onChange={handleTickerChange2}>
                </TextField>
                <TextField label="Second Type" defaultValue={args.args.type2} variant="filled" onChange={handleTypeChange2}>
                </TextField>
                <TextField label="Second Label" defaultValue={args.args.label2} variant="filled" onChange={handleLabelChange2}>
                </TextField>
            </Card>
            <Card>
                <Button>
                    Add Chart
                </Button>
                <MyChart2 args={displayValues} />
            </Card>
        </>
    );
}
export default MyChart2Settings;