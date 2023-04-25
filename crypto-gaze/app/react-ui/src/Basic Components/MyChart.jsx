import React, { useState, useEffect } from "react";
import { LineChart } from "@ui5/webcomponents-react-charts";
import axios from "axios";
import { Button } from "@ui5/webcomponents-react";
import { Title } from '@ui5/webcomponents-react';

export function MyChart(args) {

    const [dataset, setDataset] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);


    const fetchData = async () => {
        let res = null;
        if(args.args.chart_type == "simple") {
            let queryString = null;
            console.log(args.args)
           
            if(args.args.forecast == "None") {
                queryString = "http://localhost:4004/catalog/Crypto?$filter=ticker eq '" + args.args.ticker + "' and type eq '" + "real"+"'";
            }
            else  {
                queryString = "http://localhost:4004/catalog/Crypto?$filter=ticker eq '" + args.args.ticker + "' and ( type eq 'real' or type eq '"+args.args.forecast+"' )";
            } 
            
            if(args.args.start_date)
            {
                queryString += " and date ge " + args.args.start_date;
            }
            if(args.args.end_date)
            {
                queryString += " and date le " + args.args.end_date;
            }
             res = await axios.get(queryString)
        }
        else {
             res = await axios.get('http://localhost:4004/catalog/Crypto' + "?$filter=date ge " + args.args.start_date + " and date le " + args.args.end_date + " and ticker eq '" + args.args.ticker + "' and type eq 'real'")
             args.args.field = "close"
        }
        setDataset(res.data.value);
        setDataFetched(dataFetched + 1);
    }

    useEffect(() => {
        if (dataFetched < 1) {
            fetchData();
        }
    },[args.args])

    return (
        <>
            <Title>{args.args.title}</Title>
            <LineChart measures={[{ accessor: `${args.args.field}`, label: `${args.args.label}` }]} dimensions={[{ accessor: "timestamp" }]} dataset={dataset} />
        </>

    );
}