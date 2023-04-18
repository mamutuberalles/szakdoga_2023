import React, { useState, useEffect } from "react";
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
import { Button } from '@mui/material';
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
        },
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
        const res = await axios.get('http://localhost:4004/catalog/' + args.args.ticker);
        const dates = pluck(res.data.value, "date");
        const data = pluck(res.data.value, args.args.type);
        if (args.args.axis2 == false) {
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
                        text: `${args.args.text}`,
                    },
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
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
                    }
                ],
            });
        }
        else {
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
                        text: `${args.args.text}`,
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
            const res2 = await axios.get('http://localhost:4004/catalog/' + args.args.ticker2);
            const data2 = pluck(res2.data.value, args.args.type2);
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
        setDataFetched(dataFetched + 1);
    }


    const [dataFetched, setDataFetched] = useState(0);

    useEffect(() => {
        if (dataFetched < 3) {
            fetchData();
            console.log(args.args);
        }
    });



    return (
        <>
            <Line options={options} data={data} />
        </>
    );
};

export default MyChart2;