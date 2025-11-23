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
      try {
        // Add a small delay to ensure backend is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const res = await axios.get("/api/session", { 
          withCredentials: true,
          timeout: 5000
        });
        if (res.status === 200 && res.data) {
          setUser(formatUserData(res.data.user));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn("Failed to restore session user:", err.message || err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    restoreSession();
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGIN FUNCTION ======================== //
  ///////////////////////////////////////////////////////////////////////

  // Login function
  const login = async (email, password) => {
    try {
      // Use relative path - Vite proxy routes to backend
      const res = await axios.post(
        "/api/login",
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
      // Use relative path - Vite proxy routes to backend
      await axios.post("/api/logout", {}, { withCredentials: true }).catch(
        () => {}
      );
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
    return <div>
      Loading...
      
    </div>;
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= PROVIDE CONTEXT ======================= //
  ///////////////////////////////////////////////////////////////////////

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
