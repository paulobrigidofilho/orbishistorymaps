///////////////////////////////////////////////////////////////////////
// ======================= AUTH PROVIDER COMPONENT ================= //
///////////////////////////////////////////////////////////////////////

// This component provides authentication context to the app, managing user state,
// login, and logout functionalities, and ensuring user data is persisted across sessions.

// ====== Module imports ====== //
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import getPublicConfig from "../auth/helpers/getPublicConfig"; // new import

///////////////////////////////////////////////////////////////////////
// ========================= CREATE AUTH CONTEXT =================== //
///////////////////////////////////////////////////////////////////////

// Create the AuthContext
export const AuthContext = createContext(null);

// Define the formatUserData helper function before using it
const formatUserData = (userData) => {
  if (!userData) return null;

  // Ensure avatar URL is properly formatted using environment variable
  let avatarUrl = userData.avatar;
  if (avatarUrl && !avatarUrl.startsWith("http")) {
    avatarUrl = `${process.env.REACT_APP_API_URL}${avatarUrl}`;
  }

  return {
    ...userData,
    avatar: avatarUrl,
  };
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
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

  useEffect(() => {
    // New useEffect to handle initial loading
    // Set loading to false after initial check, regardless of whether a user is found
    setLoading(false);
  }, []);

  // Restore session user from server on mount
  useEffect(() => {
    (async () => {
      try {
        const baseUrl = await getPublicConfig();
        const url = baseUrl ? `${baseUrl}/api/session` : `/api/session`;
        const res = await axios.get(url, { withCredentials: true });
        if (res.status === 200 && res.data && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        // If fetching session fails, we keep user as-is (no crash)
        console.warn("Failed to restore session user:", err.message || err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGIN FUNCTION ======================== //
  ///////////////////////////////////////////////////////////////////////

  // Login function
  const login = async (email, password) => {
    const baseUrl = await getPublicConfig();
    const url = baseUrl ? `${baseUrl}/api/login` : `/api/login`;

    try {
      const res = await axios.post(
        url,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data && res.data.user) {
        // persist user in context so NavBar updates immediately
        setUser(res.data.user);
        return res.data.user;
      }
      throw new Error(res.data?.message || "Login failed");
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGOUT FUNCTION ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Logout function
  const logout = async () => {
    try {
      const baseUrl = await getPublicConfig();
      const url = baseUrl ? `${baseUrl}/api/logout` : `/api/logout`;
      await axios.post(url, {}, { withCredentials: true }).catch(() => {});
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
