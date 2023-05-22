import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import axios from "axios";
import { Card,  CardHeader } from "@mui/material";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export function MyChart2Update(args) {
    const [options, setOptions] = useState({
        responsive: true,
        plugins: {
        },
        scales: {
        }
    });


    const [data, setData] = useState({
        labels: [],
        datasets: [
        ]
    })

    function pluck(arr, identifier) {
        return arr.map(item => item[identifier]);
    }


    const fetchData = async () => {
        setDataFetched(dataFetched + 1);

        let queryString = "http://localhost:4004/catalog/Crypto?$filter=ticker eq '" + args.args.ticker + "' and type eq 'real'"
        if (args.args.start_date) {
            queryString += " and date ge " + args.args.start_date;
        }
        if (args.args.end_date) {
            queryString += " and date le " + args.args.end_date;
        }
        queryString += "&$orderby=date asc&$top=5000"
        const res1 = await axios.get(queryString);
        const dates = pluck(res1.data.value, "date");
        const data = pluck(res1.data.value, args.args.field);
        let axis2 = !(args.args.ticker2 === "" || args.args.ticker2 === "undefined")
        let queryString2 = null;
        if (axis2) {
            queryString2 = "http://localhost:4004/catalog/Crypto?$filter=ticker eq '" + args.args.ticker2 + "' and type eq 'real'"
            if (args.args.start_date) {
                queryString2 += " and date ge " + args.args.start_date;
            }
            if (args.args.end_date) {
                queryString2 += " and date le " + args.args.end_date;
            }
            queryString2 += "&$orderby=date asc&$top=5000"
            const res2 = await axios.get(queryString2);
            const data2 = pluck(res2.data.value, args.args.field2);
            setOptions({
                responsive: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                //chart.options.plugins.legend.title.position = 'start';
                plugins: {
                    legend: {
                      position: 'bottom',
                      align: 'start',
                      title: {
                        position: 'start',
                      },
                    },
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                },
            });
            setData({
                labels: dates,
                datasets: [
                    {
                        label: args.args.label,
                        data: data,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        yAxisID: 'y',
                    },
                    {
                        label: args.args.label2,
                        data: data2,
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        yAxisID: 'y1',
                    },
                ],
            });
        }
        else {
            setOptions({
                responsive: false,
                plugins: {
                    legend: {
                      position: 'bottom',
                      align: 'start',
                      title: {
                        position: 'start',
                      },
                    },
                },
            });
            setData({
                labels: dates,
                datasets: [
                    {
                        label: args.args.label,
                        data: data,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    }
                ]
            });
        }



    }

    const [dataFetched, setDataFetched] = useState(0);

    useEffect(() => {
        if (dataFetched < 1) {
            fetchData();
        }
    }, [args]);



    return (
        <>
            <Card >
                <CardHeader title={args.args.title} />
                <Line options={options} data={data} />
            </Card>


        </>
    );
};

export default MyChart2Update;