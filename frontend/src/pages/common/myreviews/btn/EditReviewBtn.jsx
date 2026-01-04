///////////////////////////////////////////////////////////////////////
// =================== EDIT REVIEW BUTTON =========================== //
///////////////////////////////////////////////////////////////////////

// This component renders an edit button for user reviews
// Used in MyReviews page to allow users to edit their reviews

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
 * EditReviewBtn - A button component for editing user reviews
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler function
 * @param {React.ReactNode} props.children - Button text/content
 * @param {boolean} props.disabled - Whether the button is disabled
 * @returns {React.ReactElement} The edit button component
 */
export default function EditReviewBtn({ onClick, children, disabled = false }) {
  ///////////////////////////////////////////////////////////////////////
  // =================== COMPUTED STYLES ============================== //
  ///////////////////////////////////////////////////////////////////////

  const buttonStyle = {
    ...BUTTON_STYLES.base,
    ...BUTTON_STYLES.primary,
    ...(disabled ? BUTTON_STYLES.disabled : {}),
  };

  ///////////////////////////////////////////////////////////////////////
  // =================== JSX BELOW ==================================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      aria-label="Edit review"
    >
      {children || "Edit your review"}
    </button>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== PROP TYPES =================================== //
///////////////////////////////////////////////////////////////////////

EditReviewBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool,
};
