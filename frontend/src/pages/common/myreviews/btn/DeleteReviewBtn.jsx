///////////////////////////////////////////////////////////////////////
// =================== DELETE REVIEW BUTTON ========================= //
///////////////////////////////////////////////////////////////////////

// This component renders a delete button for user reviews
// Used in MyReviews page to allow users to delete their reviews

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
  danger: {
    background: "#d32f2f",
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
 * DeleteReviewBtn - A button component for deleting user reviews
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler function
 * @param {React.ReactNode} props.children - Button text/content
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.isLoading - Whether a delete operation is in progress
 * @returns {React.ReactElement} The delete button component
 */
export default function DeleteReviewBtn({
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
    ...BUTTON_STYLES.danger,
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
      aria-label="Delete review"
    >
      {isLoading ? "Deleting..." : children || "Delete"}
    </button>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== PROP TYPES =================================== //
///////////////////////////////////////////////////////////////////////

DeleteReviewBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};
