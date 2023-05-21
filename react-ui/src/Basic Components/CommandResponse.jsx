import React, { useEffect, useState } from "react";
import {   Text, Card,  CardHeader } from '@ui5/webcomponents-react';


export default function CommandResponse(args) {

    const [title, setTitle] = useState();

    useEffect(() => {
        let title = args.arg
        if(typeof(title)=="string") {
            if(args.arg.includes("ERROR"))
            {
                setTitle("Script ran with errors")
            }
            else {
                setTitle("Script ran successfully")
            }
        }
       
    }, [args.arg])

    return (
        <>
            <Card header={<CardHeader titleText={title} />} >
                <Text>
                    {args.arg}
                </Text>
            </Card>
        </>
    )
}