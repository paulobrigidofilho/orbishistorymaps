///////////////////////////////////////////////////////////////////////
// ======================= AUTH PROVIDER COMPONENT ================= //
///////////////////////////////////////////////////////////////////////

// This component provides authentication context to the app, managing user state,
// login, and logout functionalities, and ensuring user data is persisted across sessions.

// ====== Module imports ====== //
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import handleLogin from "../auth/functions/handleLogin";
import handleLogout from "../auth/functions/handleLogout";
import { API_BASE } from "../auth/constants/authConstants";

// Singleton to prevent duplicate session requests (StrictMode double render)
let sessionRestorePromise = null;

///////////////////////////////////////////////////////////////////////
// ========================= CREATE AUTH CONTEXT =================== //
///////////////////////////////////////////////////////////////////////

// Create the AuthContext
export const AuthContext = createContext(null);

// Define the formatUserData helper function before using it
// Note: Converts id to String to match backend createUserProfile helper format.
// This ensures consistent strict equality (===) comparisons across the app
// (e.g., Profile.jsx ownership checks, profileValidator.js, handleProfileSubmit.js)
const formatUserData = (userData) => {
  if (!userData) return null;
  return {
    ...userData,
    id: String(userData.id),
    avatar: userData.avatar || null,
    role: userData.role || "user",
    status: userData.status || "active",
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

  // Single useEffect for session restore (deduped, no retry spam)
  useEffect(() => {
    let active = true;

    if (!sessionRestorePromise) {
      sessionRestorePromise = axios
        .get(`${API_BASE}/api/session`, { withCredentials: true, timeout: 4000 })
        .then((res) => res.data?.user || null)
        .catch(() => null);
    }

    sessionRestorePromise
      .then((userData) => {
        if (!active) return;
        setUser(userData ? formatUserData(userData) : null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGIN FUNCTION ======================== //
  ///////////////////////////////////////////////////////////////////////

  const login = async (email, password) => {
    const user = await handleLogin(email, password);
    setUser(user);
    return user;
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGOUT FUNCTION ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Logout function
  const logout = async () => {
    await handleLogout();
    setUser(null);
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
