import { Card, SideNavigation, SideNavigationItem } from "@ui5/webcomponents-react";
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
                <SideNavigationItem text="Home" onClick={handleClick} id="home"/>
                <SideNavigationItem text="My Charts" onClick={handleClick} id="charts" />
                <SideNavigationItem text="Create Simple Chart" onClick={handleClick} id="addsimplechart" />
                <SideNavigationItem text="Create Complex Chart" onClick={handleClick} id="addcomplexchart" />
                <SideNavigationItem text="Modify or Delete Chart" onClick={handleClick} id="chartmodifier" />
            </SideNavigation>
        </>
    );
};

export default Sidebar