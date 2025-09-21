
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// This is a mock User type. In a real Firebase app, you'd import `type User` from 'firebase/auth'.
type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type AuthContextType = {
  user: User | null | undefined; // undefined while loading, null if not logged in
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const storageKey = 'user-session';

  useEffect(() => {
    // Check localStorage for a saved user session
    try {
      const savedUser = localStorage.getItem(storageKey);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null); // No user saved
      }
    } catch (error) {
        console.error("Failed to parse user session from localStorage", error);
        setUser(null);
    }
  }, []);
  
  const login = (user: User) => {
    localStorage.setItem(storageKey, JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
