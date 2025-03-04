//  ========== Component imports  ========== //

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./MainNavBar.module.css";

//  ========== Images imports  ========== //

import OrbisLogo from "../../assets/common/orbislogo.png";

///////////////////////////////////////////////////////////////////////
// ========================= JSX BELOW ============================= //
///////////////////////////////////////////////////////////////////////

export default function MainNavBar() {
  return (
    <div>
      <nav>
        {/* Orbis Logo */}
        <NavLink to="/">
          <img src={OrbisLogo} alt="Orbis History Maps Logo" />
        </NavLink>

        {/* Nav Bar Links */}
        <NavLink to="/">HOME</NavLink>
        <NavLink to="#">GALLERY</NavLink>
        <NavLink to="#">SHOP</NavLink>
        <NavLink to="#">ABOUT US</NavLink>
      </nav>
    </div>
  );
}
