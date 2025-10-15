///////////////////////////////////////
// ===== KART BUTTON COMPONENT ===== //
///////////////////////////////////////

// This component renders the shopping cart button in the navigation bar

import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../MainNavBar.module.css";

const KartBtn = () => {
  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <NavLink to="/shop" className={styles.cartButton}>
      <i className="material-icons">shopping_cart</i>
    </NavLink>
  );
};

export default KartBtn;
