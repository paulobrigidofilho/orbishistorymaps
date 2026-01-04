///////////////////////////////////////////////////////////////////////
// ================ COUNTRY FLAG COMPONENT ========================= //
///////////////////////////////////////////////////////////////////////

// Displays a country flag icon with tooltip showing country name
// Used in admin tables to show user country

//  ========== Module imports  ========== //
import React from "react";
import styles from "./CountryFlag.module.css";

//  ========== Flag imports  ========== //
import NZ from "country-flag-icons/react/3x2/NZ";
import AU from "country-flag-icons/react/3x2/AU";
import BR from "country-flag-icons/react/3x2/BR";
import CA from "country-flag-icons/react/3x2/CA";
import CN from "country-flag-icons/react/3x2/CN";
import PT from "country-flag-icons/react/3x2/PT";
import GB from "country-flag-icons/react/3x2/GB";
import US from "country-flag-icons/react/3x2/US";

///////////////////////////////////////////////////////////////////////
// ================ FLAG COMPONENTS MAP ============================ //
///////////////////////////////////////////////////////////////////////

const FLAG_COMPONENTS = {
  NZ: NZ,
  AU: AU,
  BR: BR,
  CA: CA,
  CN: CN,
  PT: PT,
  GB: GB,
  US: US,
};

///////////////////////////////////////////////////////////////////////
// ================ COUNTRY CODE MAP =============================== //
///////////////////////////////////////////////////////////////////////

const COUNTRY_NAME_TO_CODE = {
  "New Zealand": "NZ",
  Australia: "AU",
  Brazil: "BR",
  Canada: "CA",
  China: "CN",
  Portugal: "PT",
  "United Kingdom": "GB",
  "United States": "US",
};

///////////////////////////////////////////////////////////////////////
// ================ COMPONENT ====================================== //
///////////////////////////////////////////////////////////////////////

/**
 * CountryFlag - Displays a country flag with hover tooltip
 *
 * @param {string} country - Country name (e.g., "Brazil", "New Zealand")
 * @param {string} size - Size variant: "small", "medium", "large" (default: "small")
 * @param {string} className - Additional CSS classes
 */
export default function CountryFlag({
  country,
  size = "small",
  className = "",
}) {
  // Get country code from name
  const countryCode = COUNTRY_NAME_TO_CODE[country];
  
  // Get flag component
  const FlagComponent = countryCode ? FLAG_COMPONENTS[countryCode] : null;

  // If no valid country or flag component, show placeholder
  if (!FlagComponent) {
    return (
      <span 
        className={`${styles.placeholder} ${styles[size]} ${className}`}
        title={country || "Unknown"}
      >
        🌍
      </span>
    );
  }

  return (
    <span 
      className={`${styles.flagWrapper} ${styles[size]} ${className}`}
      title={country}
    >
      <FlagComponent className={styles.flag} />
    </span>
  );
}
