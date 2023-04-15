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
        if(dataFetched < 5)
        {
            fetchData();
            setDataFetched(dataFetched +1);
        }
    })

    return (
        <>
{/*             <Button onClick={fetchData}>
                Fetch Data
            </Button> */}
            <LineChart measures={[{ accessor: `${args.args.type}`, label: `${args.args.ticker} - ${args.args.type}` }]} dimensions={[{ accessor: "timestamp" }]} dataset={dataset} />
        </>

    );
}