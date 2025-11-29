///////////////////////////////////////////////////////////////////////
// ======================= AUTH PROVIDER COMPONENT ================= //
///////////////////////////////////////////////////////////////////////

// This component provides authentication context to the app, managing user state,
// login, and logout functionalities, and ensuring user data is persisted across sessions.

// ====== Module imports ====== //
import { createContext, useState, useEffect } from "react";
import axios from "axios";

///////////////////////////////////////////////////////////////////////
// ========================= CREATE AUTH CONTEXT =================== //
///////////////////////////////////////////////////////////////////////

// Create the AuthContext
export const AuthContext = createContext(null);

// Define the formatUserData helper function before using it
const formatUserData = (userData) => {
  if (!userData) return null;
  return {
    ...userData,
    avatar: userData.avatar || null,
  };
};

// AuthProvider component
const AuthProvider = ({ children }) => {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [user, setUser] = useState(() => {
    // Get user from localStorage on initial load
    const storedUser = localStorage.getItem("user");
    return storedUser ? formatUserData(JSON.parse(storedUser)) : null;
  });

  const [loading, setLoading] = useState(true);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // useEffect hook to check for existing user data on initial load
  useEffect(() => {
    // Update localStorage whenever user changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Single useEffect for session restore - remove the duplicate ones
  useEffect(() => {
    const restoreSession = async () => {
      const maxAttempts = 4;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const res = await axios.get("/api/session", {
            withCredentials: true,
            timeout: 3000,
          });
          setUser(formatUserData(res.data?.user));
          break;
        } catch (err) {
          if (attempt === maxAttempts) {
            console.warn("Session restore failed:", err.message || err);
            setUser(null);
            break;
          }
          const backoff = Math.min(200 * 2 ** (attempt - 1), 1200);
          await new Promise((r) => setTimeout(r, backoff));
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGIN FUNCTION ======================== //
  ///////////////////////////////////////////////////////////////////////

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "/api/login",
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data && res.data.user) {
        setUser(res.data.user);
        return res.data.user;
      }
      throw new Error(
        res.data?.message || "Login failed (unexpected response)"
      );
    } catch (err) {
      const backendMsg = err.response?.data?.message;
      const finalMsg = backendMsg
        ? `Login request failed: ${backendMsg}`
        : `Login request failed: ${err.message}`;
      console.error(finalMsg);
      throw new Error(finalMsg);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGOUT FUNCTION ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Logout function
  const logout = async () => {
    try {
      // Use relative path - Vite proxy routes to backend
      await axios
        .post("/api/logout", {}, { withCredentials: true })
        .catch(() => {});
    } catch (err) {
      // ignore errors from logout call, still clear client state
    } finally {
      setUser(null);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= CONTEXT VALUE ========================= //
  ///////////////////////////////////////////////////////////////////////

  // Value object to be provided by the context
  const value = {
    user,
    setUser,
    login,
    logout,
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOADING STATE ========================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return <div>Loading...</div>;
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= PROVIDE CONTEXT ======================= //
  ///////////////////////////////////////////////////////////////////////

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
