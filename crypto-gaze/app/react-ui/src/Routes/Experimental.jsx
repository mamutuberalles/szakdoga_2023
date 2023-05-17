import React, { useEffect, useState } from "react";
import axios from 'axios';
import { FormControl, Select, MenuItem, TextField, InputLabel } from "@mui/material";
import DatePicker from "react-datepicker";
import moment from 'moment';
import { Button, FlexBox, Text, Card, Title } from '@ui5/webcomponents-react';
import CommandResponse from "../Basic Components/CommandResponse";


export function Experimental() {

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const [tickers, setTickers] = useState([])
    const [commandSelected, setCommandSelected] = useState()
    const [argTicker, setargTicker] = useState()
    const [commandResponse, setCommandResponse] = useState("");
    const [date, setDate] = useState();
    const [scriptRunning, setScriptRunning] = useState(false);

    const fetchTickers = async () => {
        const res = await axios.get('http://localhost:4004/catalog/Crypto?$apply=groupby((ticker))')
        setTickers(res.data.value)
    }

    useEffect(() => {
        fetchTickers()
    }, [commandSelected])

    const waitForResponse = async () => {
        let result = await axios.get('http://localhost:4004/endpoint/CommandResult')
        let n = 0;
        while (result.data.value.length === 0) {
            await delay(1000)
            n = n + 1
            result = await axios.get('http://localhost:4004/endpoint/CommandResult')
        }

        setCommandResponse(result.data.value[0].data)
        console.log("[DEBUG] Result set, n: " + n)
        console.log("[DEBUG] result.data.value[0].data: " + result.data.value[0].data)
        setScriptRunning(false)
        await axios.post('http://localhost:4004/endpoint/DeleteResult', {
        }, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })
    }

    const runScript = async () => {
        let date_local = moment(date).format("YYYY-MM-DD")
        await axios.post('http://localhost:4004/endpoint/DeleteResult', {
        }, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })

        console.log("[DEBUG] date now: " + moment(Date.now()).format("YYYY-MM-DD"))
        console.log("[DEBUG] date given: "+moment(date).format("YYYY-MM-DD"))

        if (date_local === moment(Date.now()).format("YYYY-MM-DD")) {
            date_local = null
        }

        setScriptRunning(true)
        switch (commandSelected) {
            case "add_ticker":
                await axios.post('http://localhost:4004/Catalog/AddTicker', {
                    "ticker": `${argTicker}`,
                    "date": `${date_local}`
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                break;
            case "remove_ticker":
                await axios.post('http://localhost:4004/Catalog/DeleteTicker', {
                    "ticker": `${argTicker}`,
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                break;
            case "refresh_ticker":
                await axios.post('http://localhost:4004/Catalog/RefreshTicker', {
                    "ticker": `${argTicker}`,
                    "date": `${date_local}`
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                break;
            case "monthly_charts":
                await axios.post('http://localhost:4004/Chart/RefreshCharts', {
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                break;
            default:
                break;
        }

        waitForResponse();
    }

    return (
        <>
            <Card>
                <FlexBox alignItems="Center" justifyContent="SpaceAround">
                    <Title>Choose a script: </Title>
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel>Script</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(event) => setCommandSelected(event.target.value)}
                            label="Script"
                        >
                            <MenuItem value="monthly_charts" >Monthly Chart refresh</MenuItem>
                            <MenuItem value="refresh_ticker" >Refresh ticker data</MenuItem>
                            <MenuItem value="add_ticker" >Add new ticker data</MenuItem>
                            <MenuItem value="remove_ticker" >Remove ticker data</MenuItem>

                        </Select>
                    </FormControl>

                    {commandSelected === "refresh_ticker" || commandSelected === "remove_ticker"
                        ?
                        <FormControl fullWidth sx={{ m: 1, minWidth: 200 }}  variant="outlined">
                            <InputLabel>Ticker</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                onChange={(event) => setargTicker(event.target.value)}
                                label="Ticker"
                            >
                                {tickers.map(item =>
                                    <MenuItem value={item.ticker}>{item.ticker}</MenuItem>
                                )}

                            </Select>
                        </FormControl>
                        : <> </>
                    }
                    {commandSelected === "add_ticker"
                        ? <TextField label="Ticker" variant="outlined" onChange={(event) => setargTicker(event.target.value)} />
                        : <> </>
                    }
                    {commandSelected !== "remove_ticker" && commandSelected !== "monthly_charts" && commandSelected !== undefined
                        ? <Text >Start date</Text>
                        : <> </>
                    }
                    {commandSelected !== "remove_ticker" && commandSelected !== "monthly_charts" && commandSelected !== undefined
                        ? <DatePicker selected={date} onChange={(date) => setDate(date)} dateFormat="yyyy/MM/dd" />
                        : <> </>
                    }
                    <Button onClick={runScript} disabled={scriptRunning}>
                        Run Script
                    </Button>
                </FlexBox>
            </Card>
            {commandResponse !== "" && scriptRunning === false
                ? <CommandResponse arg = {commandResponse} />
                : <> </>
            }
            {scriptRunning === true
                ? <Text> Selected script is running... </Text>
                : <> </>
            }
        </>
    );
}