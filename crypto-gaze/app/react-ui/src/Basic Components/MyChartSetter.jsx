import { LineChart } from "@ui5/webcomponents-react-charts";
import React, { useState } from "react";
import { MyChart } from "./MyChart";
import { Button, Text } from "@ui5/webcomponents-react";
import { FormControl, Select, MenuItem, useScrollTrigger } from "@mui/material";
import axios from "axios";

export function MyChartSetter(args) {

    const [ticker, setTicker] = useState("");
    const [type, setType] = useState("");

    const handleTickerChange = (event) => {
        setTicker(event.target.value);
        args.args.ticker = event.target.value;
    }

    const handleTypeChange = (event) => {
        setType(event.target.value);
        args.args.ticker = event.target.value;
    }

    const updateChart = async () => {
        const res = await axios.patch('http://localhost:4004/chart/Chart/' + args.args.id, {
            ticker: `${ticker}`,
            type: `${type}`
        },
            {
                headers: {
                }
            });
    }

    console.log(args.args);
    return (
        <>
            <div>

                <FormControl>
                    <Select
                        labelId="crypto-select-label"
                        id="crypto-select-label"
                        value={args.args.ticker}
                        onChange={handleTickerChange}
                    >
                        <MenuItem value={"BTC"}>BTC</MenuItem>
                        <MenuItem value={"ETH"}>ETH</MenuItem>
                        <MenuItem value={"XMR"}>XMR</MenuItem>
                    </Select>
                </FormControl>


                <FormControl>
                    <Select
                        labelId="type-select-label"
                        id="type-select-label"
                        value={args.args.type}
                        onChange={handleTypeChange}
                    >
                        <MenuItem value={"open"}>Open</MenuItem>
                        <MenuItem value={"close"}>Close</MenuItem>
                        <MenuItem value={"high"}>High</MenuItem>
                        <MenuItem value={"low"}>Low</MenuItem>
                        <MenuItem value={"adj_close"}>Adjusted Close</MenuItem>
                        <MenuItem value={"volume"}>Volume</MenuItem>
                    </Select>
                </FormControl>

                <Button onClick={updateChart}>
                    Update Chart
                </Button>

            </div>
        </>
    );
}