////////////////////////////////////////////////
// ===== HANDLE LOGOUT SUBMISSION =========== //
////////////////////////////////////////////////

// This function handles the user logout process
// by making an API call to the backend to terminate the session

import axios from "axios";

const handleLogout = async () => {
  try {
    await axios.post("/api/logout", {}, { withCredentials: true });
  } catch (err) {
    // Log in development for debugging, but don't block logout UX
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Logout request failed (proceeding with client-side cleanup):",
        err.message
      );
    }
  }
};

export default handleLogout;
