///////////////////////////////////////////////////////////////////////
// =================== SUBMIT REVIEW BUTTON ========================= //
///////////////////////////////////////////////////////////////////////

// This component renders a submit button for creating new reviews
// Used in review forms to submit new product reviews

///////////////////////////////////////////////////////////////////////
// =================== MODULE IMPORTS =============================== //
///////////////////////////////////////////////////////////////////////

import React from "react";
import PropTypes from "prop-types";

///////////////////////////////////////////////////////////////////////
// =================== BUTTON STYLES ================================ //
///////////////////////////////////////////////////////////////////////

const BUTTON_STYLES = {
  base: {
    borderRadius: 4,
    border: "none",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 500,
    transition: "background-color 0.2s ease",
  },
  primary: {
    background: "#ffa41c",
    color: "#fff",
  },
  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

///////////////////////////////////////////////////////////////////////
// =================== COMPONENT ==================================== //
///////////////////////////////////////////////////////////////////////

/**
 * SubmitReviewBtn - A button component for submitting new reviews
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler function
 * @param {React.ReactNode} props.children - Button text/content
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.isLoading - Whether a submit operation is in progress
 * @returns {React.ReactElement} The submit button component
 */
export default function SubmitReviewBtn({
  onClick,
  children,
  disabled = false,
  isLoading = false,
}) {
  ///////////////////////////////////////////////////////////////////////
  // =================== COMPUTED STYLES ============================== //
  ///////////////////////////////////////////////////////////////////////

  const buttonStyle = {
    ...BUTTON_STYLES.base,
    ...BUTTON_STYLES.primary,
    ...(disabled || isLoading ? BUTTON_STYLES.disabled : {}),
  };

  ///////////////////////////////////////////////////////////////////////
  // =================== JSX BELOW ==================================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label="Submit review"
    >
      {isLoading ? "Submitting..." : children || "Submit Review"}
    </button>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== PROP TYPES =================================== //
///////////////////////////////////////////////////////////////////////

SubmitReviewBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};
