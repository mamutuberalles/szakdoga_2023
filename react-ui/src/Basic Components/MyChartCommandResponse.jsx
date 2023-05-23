import React, { useState, useEffect } from "react";
import { LineChart } from "@ui5/webcomponents-react-charts";
import axios from "axios";
import { Card, CardHeader } from '@ui5/webcomponents-react';

export function MyChartCommandResponse(args) {

    const [dataset, setDataset] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);

    const fetchData = async () => {
        let res = null;
        if (args.args.chart_type === "simple") {
            let queryString = null;
            if (args.args.forecast === "None") {
                queryString = "http://localhost:4004/crypto/Crypto?$filter=ticker eq '" + args.args.ticker + "' and type eq 'real'";
            }
            else {
                queryString = "http://localhost:4004/crypto/Crypto?$filter=ticker eq '" + args.args.ticker + "' and ( type eq 'real' or type eq '" + args.args.forecast + "' )";
            }

            if (args.args.start_date) {
                queryString += " and date ge " + args.args.start_date;
            }
            if (args.args.end_date) {
                queryString += " and date le " + args.args.end_date;
            }
            queryString += "&$orderby=date asc&$top=5000"
            res = await axios.get(queryString)
        }
        else {
            res = await axios.get('http://localhost:4004/crypto/Crypto?$filter=date ge ' + args.args.start_date + " and date le " + args.args.end_date + " and ticker eq '" + args.args.ticker + "' and type eq 'real'&$orderby=date asc&$top=5000")
            args.args.field = "close"
        }

        let extra_values = args.args.extra_values
        extra_values = extra_values.split(",")
        let extra_values_dict = []
        extra_values.forEach(element => {
            if (element != "") {
                let obj = {}
                obj['date'] = element.split(':')[0]
                obj['close'] = element.split(':')[1]
                extra_values_dict.push(obj)
            }

        });



        let data = res.data.value.concat(extra_values_dict)


        setDataset(data);
        setDataFetched(dataFetched + 1);
    }

    useEffect(() => {
        if (dataFetched < 1) {
            fetchData();
        }
    }, [args.args])

    return (
        <>
            <Card header={<CardHeader titleText={args.args.title} />}>
                <LineChart measures={[{ accessor: `${args.args.field}`, label: `${args.args.label}` }]} dimensions={[{ accessor: "date", intervl: 0 }]} dataset={dataset} />
            </Card>
        </>

    );
}