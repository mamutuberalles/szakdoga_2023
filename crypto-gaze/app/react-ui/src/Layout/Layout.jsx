import React from 'react'
import { View } from 'react-native';
import { useNavigate } from "react-router-dom"
import { Header } from "./Header";
import {
    FlexBox,
    Link,
    SideNavigation,
    SideNavigationItem,
    SideNavigationSubItem,
} from '@ui5/webcomponents-react'
import { Text } from '@ui5/webcomponents-react';
import Sidebar from "./Sidebar";


const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <FlexBox fitContainer>
                <Sidebar />
                <div style={{ flex: 1}}>
                    <main>
                        {children}
                    </main>
                </div>

            </FlexBox>

        </>
    );
}
export default Layout;