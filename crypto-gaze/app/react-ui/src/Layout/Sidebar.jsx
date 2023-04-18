import { CardContent } from "@mui/material";
import { Card, SideNavigation, SideNavigationItem } from "@ui5/webcomponents-react";
import React from "react";
import { Text } from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";



export function Sidebar() {

    const navigate = useNavigate();

    const handleClick = (event) => {
        navigate('/'+event.target.id);
    };


    return (
        <>
            <SideNavigation>
                <SideNavigationItem text="Home" onClick={handleClick} id="home"/>
                {/* <SideNavigationItem text="Legacy Content" onClick={handleClick} id="legacy_content" /> */}
                <SideNavigationItem text="My Charts" onClick={handleClick} id="charts" />
                {/* <SideNavigationItem text="Edit My Charts" onClick={handleClick} id="edit" /> */}
                <SideNavigationItem text="Chart Builder BETA" onClick={handleClick} id="chartbuilder" />
                {/* <SideNavigationItem text="Multicharts" onClick={handleClick} id="multicharts" /> */}
                <SideNavigationItem text="Add Simple Chart" onClick={handleClick} id="addsimplechart" />
                <SideNavigationItem text="Add Complex Chart" onClick={handleClick} id="addcomplexchart" />
            </SideNavigation>
        </>
    );
};

export default Sidebar