import React from 'react'
import {
    FlexBox,
} from '@ui5/webcomponents-react'
import Sidebar from "./SidebarComponent";


const Layout = ({ children }) => {
    return (
        <>

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