import React from "react";
import { Sidebar, Menu, MenuItem, useProSidebar, SubMenu } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeIcon from '@mui/icons-material/Home';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { Link } from 'react-router-dom';
import AddchartIcon from '@mui/icons-material/Addchart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import CodeIcon from '@mui/icons-material/Code';

export function SidebarComponent() {
    const { collapseSidebar } = useProSidebar();
    return (
        <>
            <Sidebar style={{ height: "100vh" }}>
                <Menu>
                    <MenuItem
                        icon={<MenuOutlinedIcon />}
                        onClick={() => {
                            collapseSidebar();
                        }}
                        style={{ textAlign: "center" }}
                    >
                        {" "}
                        <h2>Menu</h2>
                    </MenuItem>
                    <MenuItem icon={<HomeIcon />} style={{ textAlign: "center" }} component={<Link to="/home" />} id="home" >Home</MenuItem>
                    <SubMenu icon = {<TrendingUpIcon/>} label="Charts"  style={{ textAlign: "center" }}>
                        <MenuItem icon={<InsertChartIcon />} style={{ textAlign: "center" }} component={<Link to="/charts" />} id="charts" >Custom Charts</MenuItem>
                        <MenuItem icon={<BookmarkAddedIcon />} style={{ textAlign: "center" }} component={<Link to="/bookmarkedcharts" />} id="bookmarkedcharts" >Bookmarked Charts</MenuItem>
                        <MenuItem icon={<VisibilityOffIcon />} style={{ textAlign: "center" }} component={<Link to="/hiddencharts" />} id="hiddencharts" >Hidden Charts</MenuItem>
                    </SubMenu>
                    
                    <SubMenu icon={<AddchartIcon />} label="Chart operations"  style={{ textAlign: "center" }}>
                        <MenuItem icon={<ShowChartIcon />} style={{ textAlign: "center" }} component={<Link to="/addsimplechart" />} id="addsimplechart" >Create UI5</MenuItem>
                        <MenuItem icon={<SsidChartIcon />} style={{ textAlign: "center" }} component={<Link to="/addcomplexchart" />} id="addcomplexchart" >Create Chart-js</MenuItem>
                        <MenuItem icon={<EditIcon />} style={{ textAlign: "center" }} component={<Link to="/chartmodifier" />} id="chartmodifier" >Update or Delete</MenuItem>
                    </SubMenu>
                    <MenuItem icon={<CodeIcon />} style={{ textAlign: "center" }} component={<Link to="/scripts" />} id="scripts" >Run Script</MenuItem>
                </Menu>
            </Sidebar>
        </>
    );
};

export default SidebarComponent