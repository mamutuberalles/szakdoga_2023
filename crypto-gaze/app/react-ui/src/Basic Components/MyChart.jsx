import React, { useState } from "react";
import { LineChart } from "@ui5/webcomponents-react-charts";


export function MyChart({datatype, dataset}) {
    return (
        <LineChart measures={[{ accessor: `${datatype}`, label: "Value" }]} dimensions={[{ accessor: "timestamp" }]} dataset={dataset} />             
    );
}