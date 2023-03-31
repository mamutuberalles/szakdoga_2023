import React, { useState } from "react";
import axios from 'axios';

import { Card, CardHeader, Text } from "@ui5/webcomponents-react";
import { spacing } from "@ui5/webcomponents-react-base";
import { BarChart, LineChart } from "@ui5/webcomponents-react-charts";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export function MyApp() {

    const handleHeaderClick = () => {
        if (toggleCharts === "lineChart") {
            setToggleCharts("barChart");
        } else {
            setToggleCharts("lineChart");
            getData();
        }
    };

    const [dataset, setDataset] = useState([])
    const [toggleCharts, setToggleCharts] = useState("barChart");
    const [datatype, setDatatype] = useState("open");

    const handleChange = (event) => {
        setDatatype(event.target.value);
    };

    const getData = async () => {
        const res = await axios.get('http://localhost:4004/catalog/BTC', dataset);
        //const temp = res.json();
        setDataset(res.data.value);
        console.log(res);
    };

    return (
        <div>
            <Card header={<CardHeader titleText="BTC-USD" interactive onClick={handleHeaderClick} />} style={{ width: "100" }} >
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={datatype}
                        label="Type"
                        onChange={handleChange}
                    >
                        <MenuItem value={"open"}>Open</MenuItem>
                        <MenuItem value={"close"}>Close</MenuItem>
                        <MenuItem value={"high"}>High</MenuItem>
                        <MenuItem value={"low"}>Low</MenuItem>
                        <MenuItem value={"adj_close"}>Adjusted Close</MenuItem>
                        <MenuItem value={"volume"}>Volume</MenuItem>
                    </Select>
                </FormControl>

                {toggleCharts === "lineChart" ? (
                    <Text style={spacing.sapUiContentPadding}>
                        {datatype} values
                    </Text>
                ) :
                    (<></>)
                }
                {toggleCharts === "lineChart" ? (
                    <LineChart measures={[{ accessor: `${datatype}`, label: "Value" }]} dimensions={[{ accessor: "timestamp" }]} dataset={dataset} />
                ) :
                    (<></>)
                }

                {/*                 <BarChart measures={[ {accessor: "open", label: "Value" } ]} dimensions={[ {accessor: "timestamp"} ]} dataset = {dataset} /> */}
            </Card>
        </div>
    );
}