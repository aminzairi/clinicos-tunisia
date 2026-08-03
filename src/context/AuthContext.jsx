// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateUser, getStoredData, setStoredData, STORAGE_KEYS, getLockInfo, setLockInfo } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Load persisted auth from localStorage if exists
    const stored = getStoredData(STORAGE_KEYS.AUTH, null);
    return stored ? stored : { user: null };
  });

  const login = async (email, password) => {
  // Retrieve current lock info
  const lockInfo = getLockInfo();
  const now = Date.now();

  // If a lock is active, reject login attempts
  if (lockInfo.lockedUntil && now < lockInfo.lockedUntil) {
    return { success: false, locked: true, message: 'Too many failed attempts. Try again later.' };
  }

  // If a previous lock has expired, clear the lock state
  if (lockInfo.lockedUntil && now >= lockInfo.lockedUntil) {
    setLockInfo({ count: 0, lockedUntil: null });
  }

  const user = await validateUser(email, password);
  if (user) {
    // Successful login – clear any lock info
    setLockInfo({ count: 0, lockedUntil: null });
    const newAuth = { user };
    setAuth(newAuth);
    setStoredData(STORAGE_KEYS.AUTH, newAuth);
    return { success: true, role: user.role };
  } else {
    // Failed login – increment failed attempt counter
    const newCount = (lockInfo.count || 0) + 1;
    const maxAttempts = 3;
    const lockDuration = 5 * 60 * 1000; // 5 minutes

    if (newCount >= maxAttempts) {
      // Apply lock
      setLockInfo({ count: newCount, lockedUntil: now + lockDuration });
      return { success: false, locked: true, message: 'Too many failed attempts. Try again later.' };
    } else {
      // Update count without locking
      setLockInfo({ count: newCount, lockedUntil: null });
      return { success: false, locked: false, message: 'Invalid credentials' };
    }
  }
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
