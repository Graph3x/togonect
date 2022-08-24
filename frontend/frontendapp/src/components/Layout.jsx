import React from "react";
import {Outlet} from "react-router-dom";

const Layout = () => {
  return (
    <>
      <p>NAVBAR IXDE</p>
      <Outlet />
    </>
  );
};

export default Layout;