"use client";
import { useLoading } from "@/contexts/LoadingContext";

export default function LoadingOverride() {
  const { forceShowContent, isLoading } = useLoading();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[60] bg-black bg-opacity-80 p-3 rounded-lg border border-gray-600">
      <div className="text-white text-sm mb-2">Loading Override</div>
      <div className="space-y-2">
        <button
          onClick={forceShowContent}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
        >
          Skip Loading
        </button>
        <div className="text-xs text-gray-400">
          Status: {isLoading ? 'Loading' : 'Complete'}
        </div>
      </div>
    </div>
  );
} 