
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type LoaderContextType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};
