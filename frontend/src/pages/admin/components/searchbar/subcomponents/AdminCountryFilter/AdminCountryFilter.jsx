///////////////////////////////////////////////////////////////////////
// ================ ADMIN COUNTRY FILTER COMPONENT ================= //
///////////////////////////////////////////////////////////////////////

// Custom country filter dropdown with SVG flag icons for admin pages

//  ========== Module imports  ========== //
import React, { useState, useRef, useEffect } from "react";
import styles from "./AdminCountryFilter.module.css";

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
// ================ COUNTRIES DATA ================================= //
///////////////////////////////////////////////////////////////////////

const COUNTRIES = [
  { code: "", name: "All Countries" },
  { code: "NZ", name: "New Zealand" },
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CN", name: "China" },
  { code: "PT", name: "Portugal" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
];

///////////////////////////////////////////////////////////////////////
// ================ COMPONENT ====================================== //
///////////////////////////////////////////////////////////////////////

export default function AdminCountryFilter({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find current country (match by name since that's what we store)
  const currentCountry = COUNTRIES.find((c) => c.name === value) || COUNTRIES[0];
  const FlagComponent = currentCountry.code ? FLAG_COMPONENTS[currentCountry.code] : null;

  ///////////////////////////////////////////////////////////////////////
  // ================ EFFECTS ======================================== //
  ///////////////////////////////////////////////////////////////////////

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ================ HANDLERS ======================================= //
  ///////////////////////////////////////////////////////////////////////

  const handleSelect = (country) => {
    // Pass empty string for "All Countries", otherwise pass the country name
    onChange(country.code ? country.name : "");
    setIsOpen(false);
  };

  ///////////////////////////////////////////////////////////////////////
  // ================ JSX BELOW ==================================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div ref={dropdownRef} className={styles.countryFilter}>
      {/* Selected Value Display */}
      <button
        type="button"
        className={styles.selectButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Filter by country"
      >
        <span className={styles.selectedValue}>
          {FlagComponent && (
            <span className={styles.flagWrapper}>
              <FlagComponent title={currentCountry.name} className={styles.flag} />
            </span>
          )}
          <span className={styles.countryName}>{currentCountry.name}</span>
        </span>
        <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {COUNTRIES.map((country) => {
            const CountryFlag = country.code ? FLAG_COMPONENTS[country.code] : null;
            const isSelected = country.name === currentCountry.name;

            return (
              <li
                key={country.code || "all"}
                className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                onClick={() => handleSelect(country)}
                role="option"
                aria-selected={isSelected}
              >
                {CountryFlag ? (
                  <span className={styles.flagWrapper}>
                    <CountryFlag title={country.name} className={styles.flag} />
                  </span>
                ) : (
                  <span className={styles.flagPlaceholder}>🌍</span>
                )}
                <span className={styles.countryName}>{country.name}</span>
                {isSelected && <span className={styles.checkmark}>✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// ================ END ADMIN COUNTRY FILTER ======================== //
///////////////////////////////////////////////////////////////////////
