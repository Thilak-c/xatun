"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { 
  Home, 
  ShoppingCart, 
  ClipboardList, 
  Menu, 
  X, 
  Search,
  Sun,
  Moon,
  User,
  Heart,
  Package,
  Shirt,
  FootprintsIcon,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get cart and wishlist counts from localStorage
  useEffect(() => {
    const updateCounts = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setCartItemCount(cart.length);
        setWishlistCount(wishlist.length);
      } catch (error) {
        console.error('Error parsing localStorage:', error);
      }
    };

    updateCounts();
    window.addEventListener('storage', updateCounts);
    return () => window.removeEventListener('storage', updateCounts);
  }, []);

  // Navigation items with better structure
  const navItems = [
    { name: "Men", path: "/men", icon: <Shirt className="w-5 h-5" /> },
    { name: "Shoes", path: "/shoes", icon: <FootprintsIcon className="w-5 h-5" /> },
    { name: "Accessories", path: "/accessories", icon: <Briefcase className="w-5 h-5" /> },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  // Close dropdown menu
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Toggle theme
  const toggleTheme = () => {
    console.log('Theme toggle clicked! Current theme:', theme);
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log('Setting new theme to:', newTheme);
    setTheme(newTheme);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300",
      isScrolled 
        ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/favicon - Copy.PNG" 
                  alt="XATUN Logo" 
                  className="w-8 h-8 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-110"
                />
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl lg:text-2xl font-bold text-foreground">
                XATUN
              </span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <a 
                  href={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:text-primary",
                    pathname === item.path 
                      ? "text-primary bg-primary/10" 
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  <span className="text-primary">{item.icon}</span>
                  <span>{item.name}</span>
                </a>
                <motion.div
                  className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg hover:bg-accent transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                onClick={toggleTheme}
                className={cn(
                  "p-2 rounded-lg hover:bg-accent transition-colors duration-200",
                  theme === "dark" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                )}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>
            )}

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/my-orders")}
                className="flex items-center space-x-2"
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden lg:inline">Orders</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/wishlist")}
                className="flex items-center space-x-2"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden lg:inline">Wishlist</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/cart")}
                className="flex items-center space-x-2 relative"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden lg:inline">Cart</span>
                {/* Cart Badge */}
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-3 text-lg bg-background/50 backdrop-blur-sm border-2 border-primary/20 focus:border-primary transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  Search
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={handleLinkClick}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-xl z-50"
            >
              <div className="container mx-auto px-4 py-6">
                {/* Navigation Items */}
                <div className="space-y-4 mb-6">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.path}
                      onClick={handleLinkClick}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg text-lg font-medium transition-all duration-300",
                        pathname === item.path 
                          ? "text-primary bg-primary/10" 
                          : "text-foreground/70 hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <span className="text-primary">{item.icon}</span>
                      <span>{item.name}</span>
                    </motion.a>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push("/my-orders")}
                    className="w-full justify-start"
                  >
                    <ClipboardList className="w-5 h-5 mr-3" />
                    My Orders
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push("/wishlist")}
                    className="w-full justify-start"
                  >
                    <Heart className="w-5 h-5 mr-3" />
                    Wishlist
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push("/cart")}
                    className="w-full justify-start relative"
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Cart
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      0
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export { Navbar };