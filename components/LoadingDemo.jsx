"use client";
import { motion } from "framer-motion";
import { useDataLoading } from "@/hooks/usePageLoading";

export default function LoadingDemo() {
  const { startLoading, stopLoading, showLoadingWithDuration } = useDataLoading();

  const demoOperations = [
    {
      name: "Quick Save",
      duration: 800,
      message: "Saving changes..."
    },
    {
      name: "Data Processing",
      duration: 2000,
      message: "Processing data..."
    },
    {
      name: "Image Upload",
      duration: 3000,
      message: "Uploading image..."
    },
    {
      name: "Long Operation",
      duration: 5000,
      message: "Performing complex operation..."
    }
  ];

  const handleDemoOperation = (operation) => {
    if (operation.duration < 1000) {
      // Quick operations use timed loading
      showLoadingWithDuration(operation.message, operation.duration);
    } else {
      // Longer operations use manual control
      startLoading(operation.message);
      setTimeout(() => {
        stopLoading();
      }, operation.duration);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 to-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-white text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🚀 Loading System Demo
        </motion.h1>
        
        <motion.p 
          className="text-gray-300 text-center mb-12 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Test different loading states and animations
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoOperations.map((operation, index) => (
            <motion.div
              key={operation.name}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                {operation.name}
              </h3>
              <p className="text-gray-400 mb-4">
                Duration: {operation.duration}ms
              </p>
              <p className="text-gray-300 mb-4">
                Message: "{operation.message}"
              </p>
              <button
                onClick={() => handleDemoOperation(operation)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Test Loading
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            🎯 How It Works
          </h2>
          <div className="text-gray-300 space-y-2">
            <p>• <strong>Quick operations</strong> (under 1s) use timed loading</p>
            <p>• <strong>Longer operations</strong> use manual start/stop control</p>
            <p>• <strong>Page navigation</strong> automatically shows loading</p>
            <p>• <strong>Custom messages</strong> for different operations</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 