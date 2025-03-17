//  ========== Component imports  ========== //

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User object or null if not logged in
  const [loading, setLoading] = useState(true); // Loading state during initial check

  //  ==========  useEffect section ========== //

  useEffect(() => {
    // Check for user data in local storage or cookies on initial load
    // (This is a placeholder - implement your actual logic here)
    const storedUser = localStorage.getItem('user'); // Example using local storage
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Make API call to your backend to authenticate user
    // On success, set the user object and store it (e.g., in local storage)
    // Example:
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user)); // Example
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw the error for the component to handle
    }
  };

  const logout = () => {
    // Clear user data from state and storage
    setUser(null);
    localStorage.removeItem('user'); // Example
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};