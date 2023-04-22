import React, { useState, useEffect, useReducer } from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./Routes/Home";
import Layout from "./Layout/Layout";
import Charts from "./Routes/Charts";
import AddSimpleChart from "./Routes/AddSimpleChart";
import AddComplexChart from "./Routes/AddComplexChart";

export function MyApp() {

    return (
        <>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Navigate replace to="/home" />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/charts" element={<Charts />} />
                        <Route path="/addsimplechart" element={<AddSimpleChart />} />
                        <Route path="/addcomplexchart" element={<AddComplexChart />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </>
    );

}