////////////////////////////////////////////////
// ===== HANDLE LOGOUT SUBMISSION =========== //
////////////////////////////////////////////////

// This function handles the user logout process
// by making an API call to the backend to terminate the session

import axios from "axios";

const handleLogout = async () => {
  try {
    await axios
      .post("/api/logout", {}, { withCredentials: true })
      .catch(() => {});
  } catch (err) {}
};

export default handleLogout;
