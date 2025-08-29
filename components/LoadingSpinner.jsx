"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLoading } from "@/contexts/LoadingContext";
import { cn } from "@/lib/utils";

const LoadingSpinner = () => {
  const { isLoading, loadingMessage, contentVisible } = useLoading();

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center max-w-md mx-auto px-4">
        {/* Main Spinner */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer Ring */}
          <motion.div
            className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Inner Ring */}
          <motion.div
            className="absolute w-20 h-20 md:w-28 md:h-28 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Center Logo */}
          <motion.div
            className="absolute w-16 h-16 md:w-24 md:h-24 flex items-center justify-center"
            style={{
              
              transform: 'translate(-50%, -50%)'
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img 
              src="/favicon - Copy.PNG" 
              alt="XATUN Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        {/* Loading Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            XATUN
          </h2>
          <p className="text-lg text-muted-foreground">
            {loadingMessage}
          </p>
        </motion.div>

        {/* Floating Particles */}
        <div className="relative">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
              style={{
                left: `${20 + i * 12}%`,
                top: "50%",
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div
          className="w-64 h-1 bg-muted rounded-full overflow-hidden mt-8 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-4"
        >
          <p className="text-sm text-muted-foreground">
            Loading amazing products...
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner; 