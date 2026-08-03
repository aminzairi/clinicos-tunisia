// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateUser, getStoredData, setStoredData, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Load persisted auth from localStorage if exists
    const stored = getStoredData(STORAGE_KEYS.AUTH, null);
    return stored ? stored : { user: null };
  });

  const login = async (email, password) => {
    const user = await validateUser(email, password);
    if (user) {
      const newAuth = { user };
      setAuth(newAuth);
      setStoredData(STORAGE_KEYS.AUTH, newAuth);
      return { success: true, role: user.role };
    }
    return { success: false };
  };

  const logout = () => {
    const newAuth = { user: null };
    setAuth(newAuth);
    setStoredData(STORAGE_KEYS.AUTH, newAuth);
  };

  // Persist auth on changes
  useEffect(() => {
    setStoredData(STORAGE_KEYS.AUTH, auth);
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
