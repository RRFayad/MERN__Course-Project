import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const authCtx = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          All Users
        </NavLink>
      </li>
      {authCtx.isLoggedIn && (
        <li>
          <NavLink to="/u1/places">My Places</NavLink>
        </li>
      )}
      {authCtx.isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add Place</NavLink>
        </li>
      )}
      <li>
        {!authCtx.isLoggedIn && <NavLink to="/auth">Authenticate</NavLink>}
        {authCtx.isLoggedIn && (
          <NavLink onClick={authCtx.onLogout} to="/">
            Logout
          </NavLink>
        )}
      </li>
    </ul>
  );
};

export default NavLinks;
