import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./Routes/Home";
import Layout from "./Layout/Layout";
import Charts from "./Routes/Charts";
import AddSimpleChart from "./Routes/AddSimpleChart";
import AddComplexChart from "./Routes/AddComplexChart";
import ChartModifier from "./Routes/ChartModifier";
import { Experimental } from "./Routes/Experimental";
import BookmarkedCharts from "./Routes/BookmarkedCharts";
import HiddenCharts from "./Routes/HiddenCharts";
import { ProSidebarProvider } from "react-pro-sidebar";
export function MyApp() {

    return (
        <>
            <ProSidebarProvider>
                <BrowserRouter>
                    <Layout>
                        <Routes>
{/*                             <Route path="/" element={<Navigate replace to="/home" />} />
                            <Route path="/home" element={<Home />} /> */}
                            <Route path="/home" element={<Navigate replace to="/" />} />
                            <Route path="/" element={<Home />} />
                            <Route path="/charts" element={<Charts />} />
                            <Route path="/addsimplechart" element={<AddSimpleChart />} />
                            <Route path="/addcomplexchart" element={<AddComplexChart />} />
                            <Route path="/chartmodifier" element={<ChartModifier />} />
                            <Route path="/experimental" element={<Experimental />} />
                            <Route path="/bookmarkedcharts" element={<BookmarkedCharts />} />
                            <Route path="/hiddencharts" element={<HiddenCharts />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </ProSidebarProvider>

        </>
    );

}