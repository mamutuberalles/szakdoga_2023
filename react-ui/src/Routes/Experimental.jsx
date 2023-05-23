import React, { useEffect, useState } from "react";
import axios from 'axios';
import { FormControl, Select, MenuItem, TextField, InputLabel } from "@mui/material";
import DatePicker from "react-datepicker";
import moment from 'moment';
import { Button, FlexBox, Text, Card, Title } from '@ui5/webcomponents-react';
import CommandResponse from "../Basic Components/CommandResponse";
import uuid from "react-uuid"

export function Experimental() {

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const [tickers, setTickers] = useState([])
    const [commandSelected, setCommandSelected] = useState()
    const [argTicker, setargTicker] = useState()
    const [commandResponse, setCommandResponse] = useState("");
    const [date, setDate] = useState();
    const [endDate, setEndDate] = useState();
    const [scriptRunning, setScriptRunning] = useState(false);
    const [opKey, setOpKey] = useState();

    const fetchTickers = async () => {
        const res = await axios.get('http://localhost:4004/crypto/Crypto?$apply=groupby((ticker))')
        setTickers(res.data.value)
    }

    useEffect(() => {
        fetchTickers()
    }, [commandSelected])

    const runScript = async () => {
        let date_local = moment(date).format("YYYY-MM-DD")
        let date_local2 = moment(endDate).format("YYYY-MM-DD")
        let opkey_loc = uuid()
        setOpKey(opkey_loc)

        if (date_local === moment(Date.now()).format("YYYY-MM-DD") || date_local === "Invalid date") {
            date_local = null
        }

        if (date_local2 === moment(Date.now()).format("YYYY-MM-DD") || date_local2 === "Invalid date") {
            date_local2 = null
        }

        setScriptRunning(true)
        switch (commandSelected) {
            case "add_ticker":
                await axios.post('http://localhost:4004/crypto/AddTicker', {
                    "ticker": `${argTicker}`,
                    "date": `${date_local}`,
                    "opKey": `${opkey_loc}`
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                break;
            case "remove_ticker":
                await axios.post('http://localhost:4004/crypto/DeleteTicker', {
                    "ticker": `${argTicker}`,
                    "opKey": `${opkey_loc}`
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                break;
            case "refresh_ticker":
                await axios.post('http://localhost:4004/crypto/RefreshTicker', {
                    "ticker": `${argTicker}`,
                    "date": `${date_local}`,
                    "opKey": `${opkey_loc}`
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                break;
            case "monthly_charts":
                await axios.post('http://localhost:4004/Chart/RefreshCharts', {
                    "opKey": `${opkey_loc}`
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                break;
            case "analyze_ticker":
                await axios.post('http://localhost:4004/Endpoint/Analyst', {
                    "ticker": `${argTicker}`,
                    "start_date": `${date_local}`,
                    "end_date": `${date_local2}`,
                    "opKey": `${opkey_loc}`
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

        // TODO Add opKey field to identify which command is the result
        let result = await axios.get('http://localhost:4004/endpoint/CommandResult?$filter=opKey eq \'' + opkey_loc + '\'')
        while (result.data.value.length === 0 && window.location.pathname == "/experimental") {
            await delay(500)
            result = await axios.get('http://localhost:4004/endpoint/CommandResult?$filter=opKey eq \'' + opkey_loc + '\'')
        }

        setCommandResponse(result.data.value[0].data)
        setScriptRunning(false)
        await axios.post('http://localhost:4004/endpoint/DeleteResult', {
            "opKey": opkey_loc
        }, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })
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
                            <MenuItem value="analyze_ticker" >Analyze ticker data</MenuItem>

                        </Select>
                    </FormControl>

                    {commandSelected === "refresh_ticker" || commandSelected === "remove_ticker" || commandSelected === "analyze_ticker"
                        ?
                        <FormControl fullWidth sx={{ m: 1, minWidth: 200 }} variant="outlined">
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
                    {commandSelected === "analyze_ticker"
                        ? <Text >End date</Text>
                        : <> </>
                    }
                    {commandSelected === "analyze_ticker"
                        ? <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy/MM/dd" />
                        : <> </>
                    }
                    <Button onClick={runScript} disabled={scriptRunning}>
                        Run Script
                    </Button>
                </FlexBox>
            </Card>
            {commandResponse !== "" && scriptRunning === false
                ? <CommandResponse arg={commandResponse} />
                : <> </>
            }
            {scriptRunning === true
                ? <Text> Selected script is running... </Text>
                : <> </>
            }
        </>
    );
}