import React from "react";
import {Outlet, useLocation} from "react-router-dom";
import Navbar from "./navbar";
import '../styles.css';

const Layout = () => {

  let location = useLocation()

  return (
    <>
      {location.pathname == '/' ? null : <Navbar/>}
      <Outlet/>
    </>
  );
};

export default Layout;