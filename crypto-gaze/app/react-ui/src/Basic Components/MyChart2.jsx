import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Button } from '@ui5/webcomponents-react';
import axios from "axios";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function MyChart2(args) {

    const navigate = useNavigate()

    const unhide = async () => {
        args.args.hidden = "false"
        const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })
        console.log(res)
        navigate('/charts')
    }

    const hide = async () => {
        args.args.hidden = "true"
        const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })
        console.log(res)
        navigate('/hiddencharts')
    }

    const bookmark = async () => {
        args.args.bookmarked = "true"
        const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })
        console.log(res)
        navigate('/bookmarkedcharts')
    }

    const unbookmark = async () => {
        args.args.bookmarked = "false"
        const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })
        console.log(res)
        navigate('/charts')
    }



    const [options, setOptions] = useState({
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
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
        //console.log(args.args)
        setDataFetched(dataFetched +1);
        let res = null;
        let queryString = "http://localhost:4004/catalog/Crypto?$filter=ticker eq '" + args.args.ticker + "'"  + " and type eq 'real'"
        if (args.args.start_date) {
            queryString += " and date ge " + args.args.start_date;
        }
        if (args.args.end_date) {
            queryString += " and date le " + args.args.end_date;
        }
        queryString += "&$orderby=date asc"
        const res1 = await axios.get(queryString);
        const dates = pluck(res1.data.value, "date");
        const data = pluck(res1.data.value, args.args.field);
        let axis2 = (args.args.ticker2 != "")
        let queryString2 = null;
        if (axis2) {
            queryString2 = "http://localhost:4004/catalog/Crypto?$filter=ticker eq '" + args.args.ticker2 +"'"  + " and type eq 'real'"
            if (args.args.start_date) {
                queryString2 += " and date ge " + args.args.start_date;
            }
            if (args.args.end_date) {
                queryString2 += " and date le " + args.args.end_date;
            }
            queryString2 += "&$orderby=date asc"
            const res2 = await axios.get(queryString2);
            const data2 = pluck(res2.data.value, args.args.field2);
            setOptions({
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${args.args.title}`,
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

                responsive: true,
/*                 interaction: {
                    mode: 'index',
                    intersect: false,
                }, */
                stacked: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${args.args.title}`,
                    },
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                }

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
    },[args]);



    return (
        <>
            <Line options={options} data={data} />
            {args.args.hidden == "true"
                ? <Button onClick={unhide}> Unhide Chart </Button>
                : <> </>
            }
            {args.args.hidden == "false"
                ? <Button onClick={hide}> Hide Chart </Button>
                : <> </>
            }
            {args.args.bookmarked == "true"
                ? <Button onClick={unbookmark}> Remove Bookmark </Button>
                : <> </>
            }
            {args.args.bookmarked == "false"
                ? <Button onClick={bookmark}> Bookmark </Button>
                : <> </>
            }
        </>
    );
};

export default MyChart2;