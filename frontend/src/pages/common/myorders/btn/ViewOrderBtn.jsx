///////////////////////////////////////////////////////////////////////
// =================== VIEW ORDER BUTTON ============================ //
///////////////////////////////////////////////////////////////////////

// This component renders a view details button for orders
// Used in MyOrders page to navigate to order details

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
    background: "#3498db",
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
 * ViewOrderBtn - A button component for viewing order details
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler function
 * @param {React.ReactNode} props.children - Button text/content
 * @param {boolean} props.disabled - Whether the button is disabled
 * @returns {React.ReactElement} The view order button component
 */
export default function ViewOrderBtn({ onClick, children, disabled = false }) {
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
      aria-label="View order details"
    >
      {children || "View Details"}
    </button>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== PROP TYPES =================================== //
///////////////////////////////////////////////////////////////////////

ViewOrderBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool,
};
