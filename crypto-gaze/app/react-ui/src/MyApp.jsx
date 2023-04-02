import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios';

import { MyChart } from "./Basic Components/MyChart";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { Card, CardHeader, FlexBox, SideNavigation, SideNavigationItem, Text, Toolbar, Bar, FlexibleColumnLayout } from "@ui5/webcomponents-react";
import { spacing } from "@ui5/webcomponents-react-base";
import { BarChart, LineChart } from "@ui5/webcomponents-react-charts";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { MyAppLegacy } from "./Routes/MyAppLegacy";
import { Home } from "./Routes/Home";
import Layout from "./Layout/Layout";

export function MyApp() {

    return (
        <>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/legacy_content" element ={<MyAppLegacy />} />
                        <Route path="/" element = {<Navigate replace to="/home" />} />
                        <Route path="/home" element = {<Home /> } />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </>
    );

}