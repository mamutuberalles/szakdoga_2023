import React, { useEffect, useState } from "react";
import axios from 'axios';
import { FormControl, Select, MenuItem, Button, TextField } from "@mui/material";

export function Experimental() {

    const [tickers, setTickers] = useState([])
    const [commandSelected, setCommandSelected] = useState()
    const [argTicker, setargTicker] = useState()
    const [commandResponse, setCommandResponse] = useState();

    const fetchTickers = async () => {
        const res = await axios.get('http://localhost:4004/catalog/Crypto?$apply=groupby((ticker))')
        setTickers(res.data.value)
    }

    useEffect(() => {
        fetchTickers()
    }, [commandSelected])

    const runScript = async () => {

        switch (commandSelected) {
            case "add_ticker":
                let res1 = await axios.post('http://localhost:4004/Catalog/AddTicker', {
                    "ticker": `${argTicker}`,
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                return;
            case "remove_ticker":
                let res2 = await axios.post('http://localhost:4004/Catalog/DeleteTicker', {
                    "ticker": `${argTicker}`,
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                return;
            case "refresh_ticker":
                let res3 = await axios.post('http://localhost:4004/Catalog/RefreshTicker', {
                    "ticker": `${argTicker}`,
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                return;
            case "monthly_charts":
                let res4 = await axios.post('http://localhost:4004/Chart/RefreshCharts', {
                }, {
                    headers: {
                        "Authorization": "Basic admin",
                        "Content-Type": "application/json;IEEE754Compatible=true"
                    }
                })
                return;
            default:
                break;
        }

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
            <Button onClick={runScript}>
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
        </>
    );
}