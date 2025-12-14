////////////////////////////////////////////////
// ===== HANDLE LOGIN SUBMISSION ============ //
////////////////////////////////////////////////

// This function handles the user login process
// by making an API call to the backend with provided credentials

// ====== Module Imports ===== //

import axios from "axios";
import { API_BASE } from "../constants/authConstants";

const handleLogin = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_BASE}/api/login`,
      { email, password },
      { withCredentials: true }
    );
    if (response.status === 200 && response.data && response.data.user) {
      return response.data.user;
    }
    throw new Error(response.data?.message || "Login failed (unexpected response)");
  } catch (error) {
    const status = error.response?.status;
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail;

    const finalMsg = backendMsg
      ? `Login request failed${status ? ` (${status})` : ""}: ${backendMsg}`
      : status
      ? `Login request failed (${status})`
      : `Login request failed: ${error.message}`;

    console.error(finalMsg);
    throw new Error(finalMsg);
  }
};

export default handleLogin;
