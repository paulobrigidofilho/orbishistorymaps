////////////////////////////////////////////////
// ===== HANDLE LOGIN SUBMISSION ============ //
////////////////////////////////////////////////

// This function handles the user login process
// by making an API call to the backend with provided credentials

import axios from "axios";

const handleLogin = async (email, password) => {
  try {
    const res = await axios.post(
      "/api/login",
      { email, password },
      { withCredentials: true }
    );
    if (res.status === 200 && res.data && res.data.user) {
      return res.data.user;
    }
    throw new Error(res.data?.message || "Login failed (unexpected response)");
  } catch (err) {
    const backendMsg = err.response?.data?.message;
    const finalMsg = backendMsg
      ? `Login request failed: ${backendMsg}`
      : `Login request failed: ${err.message}`;
    console.error(finalMsg);
    throw new Error(finalMsg);
  }
};

export default handleLogin;
