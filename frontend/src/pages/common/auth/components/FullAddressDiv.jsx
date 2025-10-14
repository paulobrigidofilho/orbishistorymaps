//////////////////////////////////
// ===== FULL ADDRESS DIV ===== //
//////////////////////////////////

// This component handles the full address input fields including
// street address, apartment/unit, city, state/region, and zip code.

//  ========== Component imports  ========== //

import styles from "../Auth.module.css";

// ========== FullAddressDiv Component ========== //

function FullAddressDiv({
  address,
  setAddress,
  addressLine2,
  setAddressLine2,
  city,
  setCity,
  stateName,
  setStateName,
  zipCode,
  setZipCode,
  capitalizeWords,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ================================================================= //
  // ========================= JSX BELOW ============================= //
  // ================================================================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.inputContainer}>
      <h2 className={styles.inputHeader}>Full Address</h2>

      {/* Combined Address Input (Street Number + Name) */}
      <p className={styles.inputLabel}>Address:</p>
      <input
        type="text"
        placeholder="Street Number & Name"
        value={address}
        onChange={(e) => setAddress(capitalizeWords(e.target.value))}
        className={styles.inputField}
      />

      {/* Unit/Apartment Input (Address Line 2) */}
      <p className={styles.inputLabel}>Apartment / Unit: (Optional)</p>
      <input
        type="text"
        placeholder="Unit, Apt, Suite Number"
        value={addressLine2}
        onChange={(e) => setAddressLine2(e.target.value)}
        className={styles.inputField}
      />

      {/* City Input */}
      <p className={styles.inputLabel}>City / Suburb:</p>
      <input
        type="text"
        placeholder="City or Suburb"
        value={city}
        onChange={(e) => setCity(capitalizeWords(e.target.value))}
        className={styles.inputField}
      />

      {/* State/Region Input */}
      <p className={styles.inputLabel}>State / Region:</p>
      <input
        type="text"
        placeholder="State or Region"
        value={stateName}
        onChange={(e) => setStateName(capitalizeWords(e.target.value))}
        className={styles.inputField}
      />

      {/* Postcode Input */}
      <p className={styles.inputLabel}>Zip Code:</p>
      <input
        type="text"
        placeholder="Zip Code or Postcode"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        className={styles.inputField}
      />
    </div>
  );
}

export default FullAddressDiv;
