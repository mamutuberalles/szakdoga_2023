import {  SideNavigation, SideNavigationItem } from "@ui5/webcomponents-react";
import React from "react";
import { useNavigate } from "react-router-dom";



export function Sidebar() {
    const navigate = useNavigate();

    const handleClick = (event) => {
        navigate('/'+event.target.id);
    };


    return (
        <>
            <SideNavigation>
                <SideNavigationItem text="Home" onClick={handleClick} id="home" selected={window.location.pathname == "/home" ? true : false}/>
                <SideNavigationItem text="My Charts" onClick={handleClick} id="charts" selected={window.location.pathname == "/charts" ? true : false} />
                <SideNavigationItem text="Create Simple Chart" onClick={handleClick} id="addsimplechart" selected={window.location.pathname == "/addsimplechart" ? true : false}/>
                <SideNavigationItem text="Create Complex Chart" onClick={handleClick} id="addcomplexchart" selected={window.location.pathname == "/addcomplexchart" ? true : false}/>
                <SideNavigationItem text="Modify or Delete Chart" onClick={handleClick} id="chartmodifier" selected={window.location.pathname == "/chartmodifier" ? true : false}/>
                <SideNavigationItem text="Run Script" onClick={handleClick} id="experimental" selected={window.location.pathname == "/experimental" ? true : false}/>
                <SideNavigationItem text="Bookmarked Charts" onClick={handleClick} id="bookmarkedcharts" selected={window.location.pathname == "/bookmarkedcharts" ? true : false}/>
                <SideNavigationItem text="Hidden Charts" onClick={handleClick} id="hiddencharts" selected={window.location.pathname == "/hiddencharts" ? true : false}/>
            </SideNavigation>
        </>
    );
};

export default Sidebar