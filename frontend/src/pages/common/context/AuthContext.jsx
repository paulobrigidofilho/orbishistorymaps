import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

///////////////////////////////////////////////////////////////////////
// ========================= CREATE AUTH CONTEXT =================== //
// ======================= AUTH PROVIDER COMPONENT ================= //
///////////////////////////////////////////////////////////////////////

// Create the AuthContext
export const AuthContext = createContext(null);

// Define the formatUserData helper function before using it
const formatUserData = (userData) => {
  if (!userData) return null;
  
  // Ensure avatar URL is properly formatted
  let avatarUrl = userData.avatar;
  if (avatarUrl && !avatarUrl.startsWith('http')) {
    avatarUrl = `http://localhost:4000${avatarUrl}`;
  }
  
  return {
    ...userData,
    avatar: avatarUrl
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

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGIN FUNCTION ======================== //
  ///////////////////////////////////////////////////////////////////////

  // Login function
  const login = async (email, password) => {
    try {
      // Make API call to your backend to authenticate user
      const response = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });

      if (response.status === 200) {
        // Format the user data
        const userProfile = formatUserData(response.data.user);
        
        // Set the user in the context
        setUser(userProfile);

        // Store the user data in local storage
        localStorage.setItem("user", JSON.stringify(userProfile));
      } else {
        // Handle unsuccessful login
        console.error("Login failed:", response.data.message);
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGOUT FUNCTION ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Logout function
  const logout = () => {
    // Clear user data from state and storage
    setUser(null);
    localStorage.removeItem("user");
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= CONTEXT VALUE ========================= //
  ///////////////////////////////////////////////////////////////////////

  // Value object to be provided by the context
  const value = {
    user,
    loading,
    login,
    logout,
    setUser, // Make setUser available in the context
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
