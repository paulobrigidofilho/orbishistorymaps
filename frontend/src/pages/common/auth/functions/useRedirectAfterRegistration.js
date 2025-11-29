//////////////////////////////////////////////////
// ===== REDIRECT AFTER REGISTRATION HOOK ===== //
//////////////////////////////////////////////////

// This custom hook manages the redirect process after a successful registration
// by setting a success message and navigating to the home page after a delay

/**
 * Custom hook for handling redirect after successful registration
 *
 * @param {boolean} registrationSuccess - Whether registration was successful
 * @param {Function} setSuccessMessage - Function to set success message
 * @param {Function} navigate - React Router navigate function
 * @returns {void}
 */

// ===== Module Imports ===== //
import { useEffect } from "react";

// ===== useRedirectAfterRegistration Hook ===== //

const useRedirectAfterRegistration = (
  registrationSuccess,
  setSuccessMessage,
  navigate
) => {
  useEffect(() => {
    if (registrationSuccess) {
      setSuccessMessage("Registration successful! Directing back to home...");
      const timeoutId = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [registrationSuccess, navigate, setSuccessMessage]);
};

export default useRedirectAfterRegistration;
