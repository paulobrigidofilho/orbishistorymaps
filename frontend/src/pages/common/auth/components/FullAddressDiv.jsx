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
  readOnly = false,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.inputContainer}>
      <h2 className={styles.inputHeader}>Full Address</h2>

      {/* Combined Address Input (Street Number + Name) */}
      <p className={styles.inputLabel}>Address:</p>
      <input
        type="text"
        placeholder={!readOnly ? "Street Number & Name" : ""}
        value={address}
        onChange={
          !readOnly
            ? (e) => setAddress(capitalizeWords(e.target.value))
            : undefined
        }
        readOnly={readOnly}
        className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
      />

      {/* Unit/Apartment Input (Address Line 2) */}
      <p className={styles.inputLabel}>
        Apartment / Unit: {!readOnly && "(Optional)"}
      </p>
      <input
        type="text"
        placeholder={!readOnly ? "Unit, Apt, Suite Number" : ""}
        value={addressLine2}
        onChange={
          !readOnly ? (e) => setAddressLine2(e.target.value) : undefined
        }
        readOnly={readOnly}
        className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
      />

      {/* City Input */}
      <p className={styles.inputLabel}>City / Suburb:</p>
      <input
        type="text"
        placeholder={!readOnly ? "City or Suburb" : ""}
        value={city}
        onChange={
          !readOnly
            ? (e) => setCity(capitalizeWords(e.target.value))
            : undefined
        }
        readOnly={readOnly}
        className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
      />

      {/* State/Region Input */}
      <p className={styles.inputLabel}>State / Region:</p>
      <input
        type="text"
        placeholder={!readOnly ? "State or Region" : ""}
        value={stateName}
        onChange={
          !readOnly
            ? (e) => setStateName(capitalizeWords(e.target.value))
            : undefined
        }
        readOnly={readOnly}
        className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
      />

      {/* Postcode Input */}
      <p className={styles.inputLabel}>Zip Code:</p>
      <input
        type="text"
        placeholder={!readOnly ? "Zip Code or Postcode" : ""}
        value={zipCode}
        onChange={!readOnly ? (e) => setZipCode(e.target.value) : undefined}
        readOnly={readOnly}
        className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
      />
    </div>
  );
}

export default FullAddressDiv;
