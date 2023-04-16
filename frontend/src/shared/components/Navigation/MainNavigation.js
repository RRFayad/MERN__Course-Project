import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom/cjs/react-router-dom";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import "./MainNavigation.css";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const toggleDrawerHandler = () => {
    setDrawerIsOpen((prevState) => !prevState);
  };

  const backdrop = (
    <div className="backdrop" onClick={toggleDrawerHandler}></div>
  );

  return (
    <>
      {drawerIsOpen &&
        ReactDOM.createPortal(backdrop, document.querySelector("#backdrop"))}
      <SideDrawer onCloseDrawer={toggleDrawerHandler} show={drawerIsOpen}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={toggleDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Your Places</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
