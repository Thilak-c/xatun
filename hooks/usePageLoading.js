"use client";
import { useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { usePathname } from 'next/navigation';

export function usePageLoading() {
  const { showLoading, hideLoading } = useLoading();
  const pathname = usePathname();

  useEffect(() => {
    // Show loading when route changes
    showLoading('Loading page...');
    
    // Hide loading after a short delay to allow content to render
    const timer = setTimeout(() => {
      hideLoading();
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, showLoading, hideLoading]);

  return { showLoading, hideLoading };
}

// Hook for data loading states
export function useDataLoading() {
  const { showLoading, hideLoading, showLoadingFor } = useLoading();

  const startLoading = (message = 'Loading data...') => {
    showLoading(message);
  };

  const stopLoading = () => {
    hideLoading();
  };

  const showLoadingWithDuration = (message, duration) => {
    showLoadingFor(message, duration);
  };

  return {
    startLoading,
    stopLoading,
    showLoadingWithDuration
  };
} 