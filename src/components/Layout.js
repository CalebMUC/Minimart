import React from "react";
import Header from './Header'
import { Outlet } from "react-router-dom";

const Layout = () =>{
    return(
        <>
            <Header/>
            <div className="page-content">
                <Outlet/>
            </div>
        </>
    )
};

export default Layout;