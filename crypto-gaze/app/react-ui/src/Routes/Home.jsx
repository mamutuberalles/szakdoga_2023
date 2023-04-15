import React, { useState } from "react"
import { Button, Text } from "@ui5/webcomponents-react";
import {Card, CardContent } from "@mui/material";
import { LineChart } from "@ui5/webcomponents-react-charts";
import { MyChart } from "../Basic Components/MyChart";
import axios from "axios";


export function Home() {

    const [chartValuesBTC, setChartValuesBTC] = useState("");
    const [chartValuesETH, setChartValuesETH] = useState("");
    const [chartValuesXMR, setChartValuesXMR] = useState("");

    const fetchData = async () => {
        const res = await axios.get('http://localhost:4004/chart/OpenChart');
        console.log(res.data.value);
        setChartValuesBTC([]);
        setChartValuesETH([]);
        setChartValuesXMR([]);
        setChartValuesBTC(res.data.value[0]);
        setChartValuesETH(res.data.value[1]);
        setChartValuesXMR(res.data.value[2]);
    }

    return (
        <div>
            <Button onClick={fetchData}>
                Fetch Data
            </Button>
            <Card>
                <CardContent>
                    <Text>
                        Welcome to Crypto Gaze!
                    </Text>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <MyChart args = {chartValuesBTC} />
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <MyChart args = {chartValuesETH} />
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <MyChart args = {chartValuesXMR} />
                </CardContent>
            </Card>
            

        </div>
    );

}