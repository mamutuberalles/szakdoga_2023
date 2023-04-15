import React, { useState } from "react";
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

export const options = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: 'Mr Gorbachov, plot that chart',
        },
    },
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left'
        },
      y1: {
        type: 'linear' ,
        display: true,
        position: 'right' ,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
};


export function ChartBuilder() {

    const [data, setData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'BTC - Close',
                data: [1, 2, 3, 4, 5, 6, 7],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y',
            }/* ,
      {
        label: 'Dataset 2',
        data: [910,820,730,640,550,460,370],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      }, */
        ],
    })

    function pluck(arr, identifier) {
        return arr.map(item => item[identifier]);
    }



    const fetchData = async () => {
        const res = await axios.get("http://localhost:4004/catalog/BTC");
        const dataset = res.data.value;
        console.log(dataset);
        const dates = pluck(dataset, "date");
        console.log(dates)
        const closes = pluck(dataset, "close");
        console.log(closes);
        const res2 = await axios.get("http://localhost:4004/catalog/ETH");
        const dataset2 = res2.data.value;
        const closes2 = pluck(dataset2, "close");

        setData({
            labels: dates,
            datasets: [
                {
                    label: 'BTC - Close',
                    data: closes,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: 'ETH - Close',
                    data: closes2,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y1',
                },
            ],
        });

    }

    return (
        <>
            <Button onClick={fetchData}>
                fetchData
            </Button>
            <Line options={options} data={data} />
        </>
    );
}

export default ChartBuilder;