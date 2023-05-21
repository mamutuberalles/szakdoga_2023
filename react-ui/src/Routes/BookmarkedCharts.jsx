import React, { useEffect, useState } from "react";
import ChartList from "../Basic Components/ChartList";

import axios from "axios";

export default function BookmarkedCharts() {

    const [fetchedCharts, setFetchedCharts] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);

    const fetchChart = async () => {
        const res = await axios.get('http://localhost:4004/chart/CustomCharts?$filter=hidden eq \'false\' and bookmarked eq \'true\' ');
        setFetchedCharts(res.data.value)
        setDataFetched(dataFetched+1)
    };

    useEffect( () =>{
        if(dataFetched < 1 )
            fetchChart();
    } )

    return (
        <>
            <ChartList charts={fetchedCharts} />
        </>
    );
}