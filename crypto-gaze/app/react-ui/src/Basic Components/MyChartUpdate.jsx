import React, { useState, useEffect } from "react";
import { LineChart } from "@ui5/webcomponents-react-charts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader } from '@ui5/webcomponents-react';

export function MyChartUpdate(args) {

    const navigate = useNavigate()

    const [dataset, setDataset] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);

    const unhide = async () => {
        try {
            args.args.hidden = "false"
            const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
                headers: {
                    "Authorization": "Basic admin",
                    "Content-Type": "application/json;IEEE754Compatible=true"
                }
            })
            console.log(res)
            navigate('/charts')
        } catch (error) {
            args.args.hidden = "true"
            console.log("[INFO] Can't use this feature right now.")
        }
    }

    const hide = async () => {

        try {
            args.args.hidden = "true"
            const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
                headers: {
                    "Authorization": "Basic admin",
                    "Content-Type": "application/json;IEEE754Compatible=true"
                }
            })
            console.log(res)
            navigate('/hiddencharts')
        } catch (error) {
            args.args.hidden = "false"
            console.log("[INFO] Can't use this feature right now.")
        }
    }

    const bookmark = async () => {

        try {
            args.args.bookmarked = "true"
            const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
                headers: {
                    "Authorization": "Basic admin",
                    "Content-Type": "application/json;IEEE754Compatible=true"
                }
            })
            //console.log(res)
            navigate('/bookmarkedcharts')
        } catch (error) {
            args.args.bookmarked = "false"
            console.log("[INFO] Can't use this feature right now.")
        }


    }

    const unbookmark = async () => {
        try {
            args.args.bookmarked = "false"
            const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
                headers: {
                    "Authorization": "Basic admin",
                    "Content-Type": "application/json;IEEE754Compatible=true"
                }
            })
            console.log(res)
            navigate('/charts')
        } catch (error) {
            args.args.bookmarked = "true"
            console.log("[INFO] Can't use this feature right now.")
        }
    }

    const fetchData = async () => {
        let res = null;
        if (args.args.chart_type == "simple") {
            let queryString = null;
            //console.log(args.args)

            if (args.args.forecast == "None") {
                queryString = "http://localhost:4004/catalog/Crypto?$filter=ticker eq '" + args.args.ticker + "' and type eq '" + "real" + "'";
            }
            else {
                queryString = "http://localhost:4004/catalog/Crypto?$filter=ticker eq '" + args.args.ticker + "' and ( type eq 'real' or type eq '" + args.args.forecast + "' )";
            }

            if (args.args.start_date) {
                queryString += " and date ge " + args.args.start_date;
            }
            if (args.args.end_date) {
                queryString += " and date le " + args.args.end_date;
            }
            queryString += "&$orderby=date asc"
            res = await axios.get(queryString)
        }
        else {
            res = await axios.get('http://localhost:4004/catalog/Crypto' + "?$filter=date ge " + args.args.start_date + " and date le " + args.args.end_date + " and ticker eq '" + args.args.ticker + "' and type eq 'real'&$orderby=date asc")
            args.args.field = "close"
        }
        setDataset(res.data.value);
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
                <LineChart measures={[{ accessor: `${args.args.field}`, label: `${args.args.label}` }]} dimensions={[{ accessor: "date", intervl:0 }]} dataset={dataset} />
            </Card>
        </>

    );
}