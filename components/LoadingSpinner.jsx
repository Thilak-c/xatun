"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "@/contexts/LoadingContext";

export default function LoadingSpinner() {
  const { isLoading, loadingMessage } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-black flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            {/* Logo */}
            <motion.div
  className="flex flex-col items-center justify-center text-xl font-bold text-white mb-8"
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  <img src="/favicon - Copy.PNG" alt="Logo" className="w-20 h-20 mb-4" />
  XATUN
</motion.div>

            
            {/* Simple Loading Spinner */}
            
            
            {/* Loading Text */}
           
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 