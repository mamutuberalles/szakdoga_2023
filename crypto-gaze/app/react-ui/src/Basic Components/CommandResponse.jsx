import React, { useEffect, useState } from "react";
import { Button, FlexBox, Text, Card, Title, CardHeader } from '@ui5/webcomponents-react';


export default function CommandResponse(args) {

    const [title, setTitle] = useState();

    useEffect(() => {
        let title = args.arg
        console.log(typeof(title))
        console.log(title)
        if(typeof(title)=="string") {
            if(args.arg.includes("ERROR"))
            {
                setTitle("Script ran with errors")
            }
            else {
                setTitle("Script ran successfully")
            }
        }
       
    })

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