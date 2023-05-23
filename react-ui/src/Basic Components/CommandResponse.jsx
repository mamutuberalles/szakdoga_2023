import React, { useEffect, useState } from "react";
import { Text, Card, CardHeader } from '@ui5/webcomponents-react';
import { MyChartUpdate } from "./MyChartUpdate";
import axios from "axios";
import moment from "moment";
import { MyChartCommandResponse } from "./MyChartCommandResponse";

export default function CommandResponse(args) {

    const [title, setTitle] = useState();
    const [resultType, setResultType] = useState(
        "simple"
    )
    const [displayValues, setDisplayValues] = useState();
    const [displayText, setDisplayText] = useState();

    const analyzeResponse = async () => {
        if (args.arg.includes(";")) {
            let text = ""
            setResultType("complex")
            let arr = args.arg.split(";")
            text = arr[0]
            let dvalues = arr[1].split(",")
            let ticker = dvalues[0].split(":")[1]
            let start_date = dvalues[1].split(":")[1]
            let end_date = dvalues[2].split(":")[1]
            let extra_values = arr[3]

            if (end_date == "null")
            {
                end_date = "9999-12-31"
            }

            setDisplayValues({
                ticker: `${ticker}`,
                field: "close",
                //label: `${label}`,
                start_date: `${start_date}`,
                end_date: `${end_date}`,
                //title: `${title}`,
                forecast: "None",
                chart_type: "simple",
                extra_values: extra_values
                //bookmarked: `${bookmarked}`,
                //hidden: `${hidden}`
    
            });

            setDisplayText(text + "\n" + arr[2])
        }
        else {
            setResultType("simple")
        }
    }

    useEffect(() => {
        let title = args.arg
        if (typeof (title) == "string") {
            if (args.arg.includes("ERROR")) {
                setTitle("Script ran with errors")
            }
            else {
                setTitle("Script ran successfully")
            }
        }

        analyzeResponse()

    }, [args.arg])

    return (
        <>
            <Card header={<CardHeader titleText={title} />} >
                {resultType === "simple"
                    ? <Text>
                        {args.arg}
                    </Text>
                    : <></>
                }
                {resultType === "complex"
                    ? <MyChartCommandResponse args={displayValues} />
                    : <></>
                }
                {resultType === "complex"
                    ? <Text>
                        {displayText}
                    </Text>
                    : <></>
                }

            </Card>
        </>
    )
}