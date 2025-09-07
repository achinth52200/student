
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'student_sync_auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, _setUser] = useState<User | null>(null);

  useEffect(() => {
    // On initial load, try to get the user from localStorage
    try {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
            _setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const setUser = (user: User | null) => {
    _setUser(user);
    if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
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
