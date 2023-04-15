import React, { useState, useEffect } from "react";
import axios from "axios";
import { MyChartSetter } from "../Basic Components/MyChartSetter";
import { Button } from "@ui5/webcomponents-react";


export function Edit() {

    const [chartValues, setChartValues] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);

    const fetchChart = async () => {
        const res = await axios.get("http://localhost:4004/chart/Chart");
        setChartValues(res.data.value);
        setDataFetched(dataFetched +1);
    };

        useEffect(() =>{
        if(dataFetched < 2)
        {
            fetchChart();
            setDataFetched(dataFetched +1);
        }
    })

    return (
        <>
            {chartValues.map(item =>
                <MyChartSetter args={item} />
            )}
        </>
    );
}

export default Edit;