///////////////////////////////////////////////////////////////////////
// ================ TOGGLE BUTTON COMPONENT ======================== //
///////////////////////////////////////////////////////////////////////

// A reusable YES/NO toggle button group for admin settings

import React from "react";
import styles from "./AdminButtons.module.css";

/**
 * ToggleButton - A YES/NO toggle button group
 * @param {Object} props - Component props
 * @param {boolean} props.value - Current toggle value
 * @param {Function} props.onChange - Handler for value change
 * @param {string} props.yesLabel - Label for YES option (default: "YES")
 * @param {string} props.noLabel - Label for NO option (default: "NO")
 * @param {boolean} props.disabled - Whether the toggle is disabled
 * @param {string} props.name - Input name for form handling
 */
const ToggleButton = ({
  value,
  onChange,
  yesLabel = "YES",
  noLabel = "NO",
  disabled = false,
  name = "toggle",
}) => {
  return (
    <div className={styles.toggleButtonGroup}>
      <button
        type="button"
        className={`${styles.toggleButton} ${value ? styles.toggleActive : ""}`}
        onClick={() => !disabled && onChange(true)}
        disabled={disabled}
        aria-pressed={value}
        name={name}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        className={`${styles.toggleButton} ${!value ? styles.toggleActive : ""}`}
        onClick={() => !disabled && onChange(false)}
        disabled={disabled}
        aria-pressed={!value}
        name={name}
      >
        {noLabel}
      </button>
    </div>
  );
};

export default ToggleButton;
