"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [contentVisible, setContentVisible] = useState(false);

  // Show loading immediately and control content visibility
  useEffect(() => {
    // Start with loading screen visible
    setIsLoading(true);
    setContentVisible(false);
    
    // Simulate app initialization time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Small delay before showing content for smooth transition
      setTimeout(() => {
        setContentVisible(true);
      }, 300);
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Function to show loading with custom message
  const showLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
    setContentVisible(false);
  };

  // Function to hide loading
  const hideLoading = () => {
    setIsLoading(false);
    setTimeout(() => {
      setContentVisible(true);
    }, 300);
  };

  // Function to show loading for a specific duration
  const showLoadingFor = (message, duration) => {
    showLoading(message);
    setTimeout(() => {
      hideLoading();
    }, duration);
  };

  // Function to force show content (for emergency cases)
  const forceShowContent = () => {
    setIsLoading(false);
    setContentVisible(true);
  };

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      loadingMessage, 
      contentVisible,
      showLoading, 
      hideLoading, 
      showLoadingFor,
      forceShowContent
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
} 