///////////////////////////////////////
// ===== CART BUTTON COMPONENT ===== //
///////////////////////////////////////

// This component renders the shopping cart button in the navigation bar

//  ========== Module imports  ========== //
import { NavLink } from "react-router-dom";
import styles from "../MainNavBar.module.css";

const CartBtn = () => {
  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <NavLink to="/cart" className={styles.cartButton}>
      <i className="material-icons">shopping_cart</i>
    </NavLink>
  );
};

export default CartBtn;
