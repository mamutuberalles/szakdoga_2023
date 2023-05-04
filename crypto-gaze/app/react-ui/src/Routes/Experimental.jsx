import React, { useEffect, useState } from "react";
import axios from 'axios';
import { FormControl, Select, MenuItem, Button } from "@mui/material";

export function Experimental() {

    const [tickers, setTickers] = useState( [] )
    const [tickersFetched, setTickersFetched] = useState(0)
    const [commandSelected, setCommandSelected] = useState()

    const runScript = async () =>{
        console.log("Script request sent with: " + commandSelected)
        const res = await axios.post('http://localhost:4004/endpoint/RunCommand',{
            "command" : `"${commandSelected}"`
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
                
                </Select>
            </FormControl>
            <Button onClick={runScript}>
                Run Script
            </Button>
        </>
    );
}