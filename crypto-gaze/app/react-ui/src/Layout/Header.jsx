import React from "react";
import { Bar } from '@ui5/webcomponents-react';
import { Text } from "@ui5/webcomponents-react";
import { ShellBar } from "@ui5/webcomponents-react";

export function Header()  {
    return (
        <>
            <ShellBar primaryTitle="This is the header!">
            </ShellBar>
        </>
    );
}