//////////////////////////////////
// ===== MAIN NAVIGATION BAR ===== //
//////////////////////////////////

// This component renders the main navigation bar of the application

//  ========== Module imports  ========== //
import { NavLink } from "react-router-dom";
import styles from "./MainNavBar.module.css";

//  ========== Component imports  ========== //
import ProfileBtn from "./btn/ProfileBtn";
import KartBtn from "./btn/KartBtn";

//  ========== Images imports  ========== //
import OrbisLogo from "../../assets/common/orbislogo.png";

export default function MainNavBar() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div>
      {/* ========================= NAVIGATION BAR ========================= */}
      <nav>
        {/* Orbis Logo */}
        <NavLink to="/">
          <img
            className={styles.orbisLogo}
            src={OrbisLogo}
            alt="Orbis History Maps Logo"
          />
        </NavLink>

        {/* Nav Bar Links */}
        <NavLink to="/">HOME</NavLink>
        <NavLink to="/gallery">GALLERY</NavLink>
        <NavLink to="/shop">SHOP</NavLink>
        <NavLink to="/aboutus">ABOUT US</NavLink>

        {/* ========================= USER NAVIGATION ========================= */}
        <div className={styles.userNav}>
          {/* Shopping Cart Button */}
          <KartBtn />

          {/* User Profile / Authentication Button */}
          <ProfileBtn />
        </div>
      </nav>
    </div>
  );
}
