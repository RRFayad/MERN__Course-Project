import React from "react";
import ReactDOM from "react-dom";

import "./SideDrawer.css";

const SideDrawer = (props) => {
  const content = <aside className="side-drawer">{props.children}</aside>;

  const backdrop = (
    <div className="backdrop" onClick={props.onCloseDrawer}></div>
  );

  return (
    <>
      {ReactDOM.createPortal(backdrop, document.querySelector("#backdrop"))}
      {ReactDOM.createPortal(content, document.querySelector("#drawer-hook"))}
    </>
  );
};

export default SideDrawer;
