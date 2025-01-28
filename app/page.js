import React from "react";
import { motion } from "framer-motion";

export default function FearlessSoulPage() {
  return (
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen text-white overflow-hidden">
      {/* Header Section */}
      <header className="text-center py-10">
        <h1 className="text-5xl font-extrabold tracking-wide text-gray-100">
          FEARLESS SOUL
        </h1>
        <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full">
          New Arrival
        </button>
      </header>

      {/* Products Carousel Section */}
      <section className="flex justify-center space-x-6 py-10 overflow-x-auto scrollbar-hide">
        {["tshirt1", "tshirt2", "tshirt3", "tshirt4", "tshirt5"].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            className="flex-shrink-0 w-40 h-40 bg-gray-800 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          >
            <img
              src={`/${item}.png`}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </motion.div>
        ))}
      </section>

      {/* Main Section */}
      <section className="relative flex justify-center items-center h-96">
        {/* Decorative Image */}
        <motion.img
          src="/angel-statue.png"
          alt="Angel Statue"
          className="absolute bottom-0 z-10 w-64 h-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />

        {/* Highlighted Text */}
        <motion.h2
          className="text-7xl font-extrabold text-red-600 tracking-wide z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          ORIGINALS
        </motion.h2>
      </section>
    </div>
  );
}
