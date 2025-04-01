import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

///////////////////////////////////////////////////////////////////////
// ========================= CREATE AUTH CONTEXT =================== //
// ======================= AUTH PROVIDER COMPONENT ================= //
///////////////////////////////////////////////////////////////////////

// Create the AuthContext
export const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {

  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [user, setUser] = useState(null); // User object or null if not logged in
  const [loading, setLoading] = useState(true); // Loading state during initial check

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // useEffect hook to check for existing user data on initial load

  useEffect(() => {
    const checkStoredUser = () => {
      try {
        // Check for user data in local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          // Parse the stored user data
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking stored user:', error);
        localStorage.removeItem('user'); // Clear local storage on error
        setUser(null);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    checkStoredUser();
  }, []); // Run only once on initial load

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGIN FUNCTION ======================== //
  ///////////////////////////////////////////////////////////////////////

  // Login function
  const login = async (email, password) => {
    try {
      // Make API call to your backend to authenticate user
      const response = await axios.post('http://localhost:4000/api/login', { email, password });

      // Check if the request was successful
      if (response.status === 200) {
        // Get the user data from the response
        const userProfile = response.data.user;

        // Set the user in the context
        setUser(userProfile);

        // Store the user data in local storage
        localStorage.setItem('user', JSON.stringify(userProfile));

        console.log('Login successful');
      } else {
        // Handle unsuccessful login
        console.error('Login failed:', response.data.message);
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed'); // Use backend error message if available
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGOUT FUNCTION ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Logout function
  const logout = () => {
    // Clear user data from state and storage
    setUser(null);
    localStorage.removeItem('user');
    console.log('Logout successful');
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