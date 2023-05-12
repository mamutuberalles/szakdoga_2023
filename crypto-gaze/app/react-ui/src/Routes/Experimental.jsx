import React, { useEffect, useState } from "react";
import axios from 'axios';
import { FormControl, Select, MenuItem, Button, TextField } from "@mui/material";
import DatePicker from "react-datepicker";
import moment from 'moment';
import { Text } from '@ui5/webcomponents-react';


export function Experimental() {

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );

    const [tickers, setTickers] = useState([])
    const [commandSelected, setCommandSelected] = useState()
    const [argTicker, setargTicker] = useState()
    const [commandResponse, setCommandResponse] = useState();
    const [date, setDate] = useState();
    const [scriptRunning, setScriptRunning] = useState(false);

    const fetchTickers = async () => {
        const res = await axios.get('http://localhost:4004/catalog/Crypto?$apply=groupby((ticker))')
        setTickers(res.data.value)
    }

    useEffect( () => {
        fetchTickers()
    }, [commandSelected])

    const waitForResponse = async () =>{
        let result = await axios.get('http://localhost:4004/endpoint/CommandResult')
        let n = 0;
        while(result.data.value.length == 0) {
            await delay(1000)
            n = n+1
            result = await axios.get('http://localhost:4004/endpoint/CommandResult')
        }

        setCommandResponse(result.data.value[0].data)
        console.log("[DEBUG] Result set, n: "+ n)
        console.log("[DEBUG] result.data.value[0].data: "+result.data.value[0].data)
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
        await axios.post('http://localhost:4004/endpoint/DeleteResult', {
        }, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })
        setScriptRunning(true)
        switch (commandSelected) {
            case "add_ticker":
                let res1 = await axios.post('http://localhost:4004/Catalog/AddTicker', {
                    "ticker": `${argTicker}`,
                    "date" : `${moment(date).format("YYYY-MM-DD")}`
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                break;
            case "remove_ticker":
                let res2 = await axios.post('http://localhost:4004/Catalog/DeleteTicker', {
                    "ticker": `${argTicker}`,
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                break;
            case "refresh_ticker":
                let res3 = await axios.post('http://localhost:4004/Catalog/RefreshTicker', {
                    "ticker": `${argTicker}`,
                    "date" : `${moment(date).format("YYYY-MM-DD")}`
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                break;
            case "monthly_charts":
                let res4 = await axios.post('http://localhost:4004/Chart/RefreshCharts', {
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
            <FormControl fullWidth>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(event) => setCommandSelected(event.target.value)}
                    variant="filled"
                >
                    <MenuItem value="monthly_charts" >Monthly Chart refresh</MenuItem>
                    <MenuItem value="refresh_ticker" >Refresh ticker data</MenuItem>
                    <MenuItem value="add_ticker" >Add new ticker data</MenuItem>
                    <MenuItem value="remove_ticker" >Remove ticker data</MenuItem>

                </Select>
            </FormControl>
            <Button onClick={runScript} disabled={scriptRunning}>
                Run Script
            </Button>
            {commandSelected == "refresh_ticker" || commandSelected == "remove_ticker"
                ?
                <FormControl fullWidth>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={(event) => setargTicker(event.target.value)}
                        variant="filled"
                    >
                        {tickers.map(item =>
                            <MenuItem value={item.ticker}>{item.ticker}</MenuItem>
                        )}

                    </Select>
                </FormControl>
                : <> </>
            }
            {commandSelected == "add_ticker"
                ? <TextField label="Ticker" variant="filled" onChange={(event) => setargTicker(event.target.value)} />
                : <> </>
            }
            {commandSelected != "remove_ticker" && commandSelected != "monthly_charts" && commandSelected != undefined
                ? <DatePicker selected={date} onChange={(date) => setDate(date)} dateFormat="yyyy/MM/dd" />
                : <> </>
            }
            <Text>
                {commandResponse}
            </Text>
        </>
    );
}