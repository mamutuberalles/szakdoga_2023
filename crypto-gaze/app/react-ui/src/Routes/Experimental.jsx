import React, { useEffect, useState } from "react";
import axios from 'axios';
import { FormControl, Select, MenuItem, Button, TextField } from "@mui/material";

export function Experimental() {

    const [tickers, setTickers] = useState([])
    const [tickersFetched, setTickersFetched] = useState(0)
    const [commandSelected, setCommandSelected] = useState()
    const [argTicker, setargTicker] = useState()

    const fetchTickers = async () => {
        const res = await axios.get('http://localhost:4004/catalog/Crypto?$apply=groupby((ticker))')
        setTickers(res.data.value)
    }

    useEffect(() => {
        fetchTickers()
    }, [commandSelected])

    const runScript = async () => {
        console.log("Script request sent with: " + commandSelected)
        const res = await axios.post('http://localhost:4004/endpoint/RunCommand', {
            "command": `"${commandSelected}"`,
            "argTicker": `${argTicker}`
        }, {
            headers: {
                "Authorization": "Basic admin",
                "Content-Type": "application/json;IEEE754Compatible=true"
            }
        })
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
                    <MenuItem value="monthly_charts.py" >Monthly Chart refresh</MenuItem>
                    <MenuItem value="refresh_data.py" >Refresh ticker data</MenuItem>
                    <MenuItem value="add_data.py" >Add new crypto data</MenuItem>

                </Select>
            </FormControl>
            <Button onClick={runScript}>
                Run Script
            </Button>
            {commandSelected == "refresh_data.py"
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
            {commandSelected == "add_data.py"
                ? <TextField label="Ticker" variant="filled" onChange={(event) => setargTicker(event.target.value)}/>
                : <> </>
            }
        </>
    );
}