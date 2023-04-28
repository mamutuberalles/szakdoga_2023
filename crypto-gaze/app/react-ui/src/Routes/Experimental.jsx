import React, { useEffect, useState } from "react";
import axios from 'axios';
import { FormControl, Select, MenuItem, Button } from "@mui/material";

export function Experimental() {

    const [tickers, setTickers] = useState( [] )
    const [tickersFetched, setTickersFetched] = useState(0)
    const [tickerSelected, setTickerSelected] = useState()

    const fetchTickers = async () => {
        const res = await axios.get('http://localhost:4004/catalog/Crypto?$apply=groupby((ticker))')
        setTickers(res.data.value)
        setTickersFetched(fetchTickers + 1)
    }

    useEffect( () =>{
        if(tickersFetched < 1) {
            fetchTickers();
        }
    } )

    const runScript = async () =>{
        console.log("Script request sent with: " + tickerSelected)
        const res = await axios.post('http://localhost:4004/endpoint/RefreshData',{
            "ticker" : `"${tickerSelected}"`
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
                    onChange={(event) => setTickerSelected(event.target.value)}
                    variant="filled"
                >
                    {tickers.map(item =>
                        <MenuItem value={item.ticker}>{item.ticker}</MenuItem>
                    )}
                
                </Select>
            </FormControl>
            <Button onClick={runScript}>
                Run Script
            </Button>
        </>
    );
}