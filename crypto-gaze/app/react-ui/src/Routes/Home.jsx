import React from "react"
import { Text } from "@ui5/webcomponents-react";
import {Card, CardContent } from "@mui/material";


export function Home() {
    return (
        <div>
            <Card>
                <CardContent>
                    <Text>
                        Welcome to Crypto Gaze!
                    </Text>
                </CardContent>
            </Card>

        </div>
    );

}