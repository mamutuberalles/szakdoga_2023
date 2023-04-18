import React, { useState, useEffect } from "react";
import { LineChart } from "@ui5/webcomponents-react-charts";
import axios from "axios";
import { Button } from "@ui5/webcomponents-react";

export function MyChart(args) {

    const [dataset, setDataset] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);
    console.log(args.args);

    const fetchData = async () => {
        const res = await axios.get('http://localhost:4004/catalog/' + args.args.ticker)
        setDataset(res.data.value);
        setDataFetched(dataFetched +1);
    }

    useEffect(() =>{
        if(dataFetched < 3)
        {
            fetchData();
        }
    })

    return (
        <>
            <LineChart measures={[{ accessor: `${args.args.type}`, label: `${args.args.label}` }]} dimensions={[{ accessor: "timestamp" }]} dataset={dataset}  />
        </>

    );
}