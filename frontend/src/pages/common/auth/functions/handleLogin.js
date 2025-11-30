////////////////////////////////////////////////
// ===== HANDLE LOGIN SUBMISSION ============ //
////////////////////////////////////////////////

// This function handles the user login process
// by making an API call to the backend with provided credentials

import axios from "axios";

// Base API URL from environment variable or default
const API_BASE = import.meta.env.VITE_API_URL;

const handleLogin = async (email, password) => {
  try {
    const url = `${API_BASE}/api/login`;
    const res = await axios.post(
      url,
      { email, password },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );
    if (res.status === 200 && res.data && res.data.user) {
      return res.data.user;
    }
    throw new Error(res.data?.message || "Login failed (unexpected response)");
  } catch (err) {
    const status = err.response?.status;
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.data?.detail;

    const finalMsg = backendMsg
      ? `Login request failed${status ? ` (${status})` : ""}: ${backendMsg}`
      : status
      ? `Login request failed (${status})`
      : `Login request failed: ${err.message}`;

    console.error(finalMsg);
    throw new Error(finalMsg);
  }
};

export default handleLogin;
