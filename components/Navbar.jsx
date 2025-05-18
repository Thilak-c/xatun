"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaShoppingCart, FaClipboardList, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

  // Navigation items
  const navItems = [
    { name: "Men", path: "/men" },
    { name: "Shoes", path: "/shoes" },
    { name: "Accessories", path: "/accessories" },
  ];

  // Close dropdown menu
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/30 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between items-center lg:h-10 h-16">
          {/* Home Icon */}
          <a href="/" aria-label="Home">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer text-lg font-medium text-white hover:text-gray-100"
            >
              <FaHome size={24} />
            </motion.div>
          </a>

          {/* Navigation Links (Always Visible) */}
          <div className="flex justify-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.1 }}
                className="group relative cursor-pointer text-lg font-medium text-center text-white hover:text-gray-100"
              >
                <a href={item.path}>
                  <span>{item.name}</span>
                </a>
                <motion.span
                  className="absolute left-0 bottom-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"
                />
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Icons (My Orders and Cart) */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="https://xatun.in/my-orders" aria-label="My Orders">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="cursor-pointer text-lg font-medium text-white hover:text-gray-100"
              >
                <FaClipboardList size={24} />
              </motion.div>
            </a>
            <a href="/cart" aria-label="Cart">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="cursor-pointer text-lg font-medium text-white hover:text-gray-100"
              >
                <FaShoppingCart size={24} />
              </motion.div>
            </a>
          </div>
        </div>

        {/* Mobile Dropdown Menu (My Orders and Cart) */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={handleLinkClick} // Close menu when backdrop is clicked
              />

              {/* Dropdown Content */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden bg-white/30 backdrop-blur-md mt-2 py-4 rounded-lg absolute right-4 left-4 z-50"
              >
                <div className="flex flex-col space-y-4">
                  <a
                    href="https://xatun.in/my-orders"
                    onClick={handleLinkClick}
                    className="text-white text-lg font-medium text-center hover:text-gray-100"
                  >
                    My Orders
                  </a>
                  <a
                    href="/cart"
                    onClick={handleLinkClick}
                    className="text-white text-lg font-medium text-center hover:text-gray-100"
                  >
                    Cart
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export { Navbar };