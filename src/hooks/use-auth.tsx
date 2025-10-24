
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useLoader } from './use-loader';
import { useRouter } from 'next/navigation';

// Simplified user type for simulation
type User = {
  uid: string;
  displayName: string | null;
  email: string | null;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  signup: (email: string, name: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER_KEY = 'guest_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { setIsLoading } = useLoader();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem(GUEST_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(GUEST_USER_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const login = useCallback((email: string, name?: string) => {
    setIsLoading(true);
    const mockUser: User = {
      uid: 'mock-user-uid-' + Math.random().toString(36).substring(2),
      email: email,
      displayName: name || email.split('@')[0],
    };
    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    setTimeout(() => {
        setIsLoading(false);
    }, 7000);
  }, [setIsLoading]);
  
  const signup = useCallback((email: string, name: string) => {
    // In simulation, signup is the same as login
    login(email, name);
  }, [login]);

  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem(GUEST_USER_KEY);
    setUser(null);
    // Directly push to the login page
    router.push('/login');
    // A small delay to allow state to update before turning loader off
    setTimeout(() => {
        setIsLoading(false);
    }, 300);
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, login, logout, signup }}>
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
