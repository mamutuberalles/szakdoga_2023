import React, { useState } from "react";
import axios from "axios";
import { MyChartSetter } from "../Basic Components/MyChartSetter";
import { Button } from "@ui5/webcomponents-react";


export function Edit() {

    const [chartValues, setChartValues] = useState([]);

    const fetchChart = async () => {
        const res = await axios.get("http://localhost:4004/chart/Chart");
        setChartValues(res.data.value);

        console.log(res.data.value);

    };

    return (
        <>
            <Button onClick={fetchChart}>
                Fetch Data
            </Button>
            {chartValues.map(item =>
                <MyChartSetter args={item} />
            )}
        </>
    );
}

export default Edit;