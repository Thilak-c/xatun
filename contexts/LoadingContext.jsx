"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Welcome to XATUN');
  const [loadingType, setLoadingType] = useState('initial'); // 'initial', 'page', 'data'
  const [progress, setProgress] = useState(0);

  // Show loading with custom message and type
  const showLoading = useCallback((message = 'Loading...', type = 'data') => {
    setLoadingMessage(message);
    setLoadingType(type);
    setIsLoading(true);
    setProgress(0);
  }, []);

  // Hide loading
  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setProgress(100);
    setTimeout(() => {
      setProgress(0);
      setLoadingType('initial');
    }, 300);
  }, []);

  // Show loading for a specific duration
  const showLoadingFor = useCallback((message, duration, type = 'data') => {
    showLoading(message, type);
    setTimeout(() => {
      hideLoading();
    }, duration);
  }, [showLoading, hideLoading]);

  // Show loading with progress
  const showLoadingWithProgress = useCallback((message, progressValue, type = 'data') => {
    setLoadingMessage(message);
    setLoadingType(type);
    setIsLoading(true);
    setProgress(progressValue);
  }, []);

  // Update progress
  const updateProgress = useCallback((progressValue) => {
    setProgress(progressValue);
  }, []);

  // Force show content (for emergency cases)
  const forceShowContent = useCallback(() => {
    setIsLoading(false);
    setProgress(100);
  }, []);

  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Progress animation for initial loading
  useEffect(() => {
    if (loadingType === 'initial' && isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [loadingType, isLoading]);

  const contextValue = {
    isLoading,
    loadingMessage,
    loadingType,
    progress,
    showLoading,
    hideLoading,
    showLoadingFor,
    showLoadingWithProgress,
    updateProgress,
    forceShowContent
  };

  return (
    <LoadingContext.Provider value={contextValue}>
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