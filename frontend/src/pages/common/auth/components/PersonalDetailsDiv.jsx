//////////////////////////////////////////////
// ===== PERSONAL DETAILS DIV COMPONENT ===== //
//////////////////////////////////////////////

// This component handles the personal information input fields including
// first name, last name, email, password, and password confirmation.

//  ========== Component imports  ========== //

import React from "react";
import styles from "../Auth.module.css";

// ========== PersonalDetailsDiv Component ========== //

function PersonalDetailsDiv({ 
  firstName, 
  setFirstName, 
  lastName, 
  setLastName, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  confirmPassword, 
  setConfirmPassword,
  capitalizeWords 
}) {
  ///////////////////////////////////////////////////////////////////////
  // ================================================================= //
  // ========================= JSX BELOW ============================= //
  // ================================================================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.inputContainer}>
      <h2 className={styles.inputHeader}>Personal Details</h2>
      
      <p className={styles.inputLabel}>First Name: *</p>
      <input
        type="text"
        placeholder="First Name (Required)"
        value={firstName}
        onChange={(e) => setFirstName(capitalizeWords(e.target.value))}
        className={styles.inputField}
      />

      <p className={styles.inputLabel}>Last Name: *</p>
      <input
        type="text"
        placeholder="Last Name (Required)"
        value={lastName}
        onChange={(e) => setLastName(capitalizeWords(e.target.value))}
        className={styles.inputField}
      />

      <p className={styles.inputLabel}>Email: *</p>
      <input
        type="email"
        placeholder="Email (Required)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.inputField}
      />

      <p className={styles.inputLabel}>Password: *</p>
      <input
        type="password"
        placeholder="Password (Required)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.inputField}
      />

      <p className={styles.inputLabel}>Confirm Password: *</p>
      <input
        type="password"
        placeholder="Confirm Password (Required)"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={styles.inputField}
      />
    </div>
  );
}

export default PersonalDetailsDiv;
