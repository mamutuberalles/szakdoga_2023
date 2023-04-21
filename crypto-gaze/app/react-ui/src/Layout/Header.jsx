import React from "react";
import { Bar } from '@ui5/webcomponents-react';
import { Text } from "@ui5/webcomponents-react";
import { ShellBar } from "@ui5/webcomponents-react";
import { Icon, Avatar } from '@ui5/webcomponents-react';


export function Header() {
    return (
        <>
            <ShellBar 
                logo={<img alt="Crypto Gaze Logo" src="https://sap.github.io/ui5-webcomponents/assets/images/sap-logo-svg.svg"/>}
                primaryTitle="Crypto Gaze">
                profile={<Avatar icon="employee" ></Avatar>}
            </ShellBar>
        </>
    );
}