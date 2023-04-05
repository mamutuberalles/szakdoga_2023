import React from "react";
import { useState } from "react";
import axios from "axios";
import { FormControl,Select,MenuItem } from "@mui/material";
import { LineChart } from "@ui5/webcomponents-react-charts";


export function ExperimentalCharts() {

    const [dataset, setDataset] = useState([])
    const [datatype1, setDatatype1] = useState("");
    const [datatype2, setDatatype2] = useState("");
    const [datatype3, setDatatype3] = useState("");

    const handleTypeChange1 = async (event) => {
        setDatatype1(event.target.value);
        console.log("[DEBUG]: Datatype changed.");
        getData();
    };

    const handleTypeChange2 = async (event) => {
        setDatatype2(event.target.value);
        console.log("[DEBUG]: Datatype changed.");
        getData();
    };

    const handleTypeChange3 = async (event) => {
        setDatatype3(event.target.value);
        console.log("[DEBUG]: Datatype changed.");
        getData();
    };

    const getData = async () => {
        const res = await axios.get('http://localhost:4004/catalog/EXPERIMENTAL');
        setDataset(res.data.value);
        console.log("[DEBUG]: Dataset changed.");
    };



    return (
        <>
                <FormControl fullWidth>
                    <Select
                        labelId="type-select-label"
                        id="type-select-label"
                        value={datatype1}
                        onChange={handleTypeChange1}
                    >
                        <MenuItem value={"btc_open"}>BTC Open</MenuItem>
                        <MenuItem value={"btc_close"}>BTC  Close</MenuItem>
                        <MenuItem value={"btc_high"}>BTC High</MenuItem>
                        <MenuItem value={"btc_low"}>BTC Low</MenuItem>
                        <MenuItem value={"btc_adj_close"}>BTC Adjusted Close</MenuItem>
                        <MenuItem value={"btc_volume"}>BTC Volume</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <Select
                        labelId="type-select-label"
                        id="type-select-label"
                        value={datatype2}
                        onChange={handleTypeChange2}
                    >
                        <MenuItem value={"eth_open"}>ETH Open</MenuItem>
                        <MenuItem value={"eth_close"}>ETH Close</MenuItem>
                        <MenuItem value={"eth_high"}>ETH High</MenuItem>
                        <MenuItem value={"eth_low"}>ETH Low</MenuItem>
                        <MenuItem value={"eth_adj_close"}>ETH Adjusted Close</MenuItem>
                        <MenuItem value={"eth_volume"}>ETH Volume</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <Select
                        labelId="type-select-label"
                        id="type-select-label"
                        value={datatype3}
                        onChange={handleTypeChange3}
                    >
                        <MenuItem value={"xmr_open"}>XMR Open</MenuItem>
                        <MenuItem value={"xmr_close"}>XMR Close</MenuItem>
                        <MenuItem value={"xmr_high"}>XMR High</MenuItem>
                        <MenuItem value={"xmr_low"}>XMR Low</MenuItem>
                        <MenuItem value={"xmr_adj_close"}>XMR Adjusted Close</MenuItem>
                        <MenuItem value={"xmr_volume"}>XMR Volume</MenuItem>
                    </Select>
                </FormControl>
                <LineChart measures={[{ accessor: `${datatype1}`, label: `${datatype1}` },
                                        { accessor: `${datatype2}`, label: `${datatype2}` },
                                        { accessor: `${datatype3}`, label: `${datatype3}` }]} dimensions={[{ accessor: "timestamp" }]} dataset={dataset} />
        </>
    );
}

export default ExperimentalCharts;