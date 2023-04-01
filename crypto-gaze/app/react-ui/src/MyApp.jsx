import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios';

import { MyChart } from "./Basic Components/MyChart";

import { Card, CardHeader, Text } from "@ui5/webcomponents-react";
import { spacing } from "@ui5/webcomponents-react-base";
import { BarChart, LineChart } from "@ui5/webcomponents-react-charts";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export function MyApp() {

    const [dataset, setDataset] = useState([])
    const [crypto, setCrypto] = useState("")
    const [datatype, setDatatype] = useState("");
    const [loglevel, setLoglevel] = useState("DEBUG");
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const handleCryptoChange = async (event) => {
        setCrypto(event.target.value);
        console.log("[DEBUG]: Crypto changed.");
        getData(event.target.value);
    }

    const handleTypeChange = async (event) => {
        setDatatype(event.target.value);
        console.log("[DEBUG]: Datatype changed.");
        getData(crypto);
    };

    const getData = async (value) => {
        const res = await axios.get('http://localhost:4004/catalog/' + value);
        setDataset(res.data.value);
        console.log("[DEBUG]: Dataset changed.");
    };

    return (
        <div>
            <Card style={{ width: "100" }} >
                <FormControl fullWidth>
                    <Select
                        labelId="crypto-select-label"
                        id="crypto-select-label"
                        value={crypto}
                        onChange={handleCryptoChange}
                    >
                        <MenuItem value={"BTC"}>BTC - USD</MenuItem>
                        <MenuItem value={"ETH"}>ETH - USD</MenuItem>
                        <MenuItem value={"XMR"}>XMR - USD</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <Select
                        labelId="type-select-label"
                        id="type-select-label"
                        value={datatype}
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
                <LineChart measures={[{ accessor: `${datatype}`, label: "Value" }]} dimensions={[{ accessor: "timestamp" }]} dataset={dataset} />
                {/* Dataset does not go trough -- need to check why */}
                {/* <MyChart type = {datatype} dataset = {dataset} /> */}
                {loglevel === "DEBUG" ? (<Text>[DEBUG] Crypto: {crypto} Type: {datatype} </Text>)
                    : (<> </>)
                }

            </Card>
        </div>
    );
}