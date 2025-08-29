"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Star, TrendingUp, Zap, Shield, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getMainImageUrl, getCategoryDisplayName, getTypeDisplayName } from "@/lib/utils";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCarouselIndex, setSelectedCarouselIndex] = useState(0);
  const router = useRouter();
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Get carousel products
  const carouselProducts = products.filter(item => item.type === "Carouselimg");
  
  // Group products by category and type
  const groupedProducts = products.reduce((acc, product) => {
    const { category, type } = product;
    if (!acc[category]) {
      acc[category] = {};
    }
    if (!acc[category][type]) {
      acc[category][type] = [];
    }
    acc[category][type].push(product);
    return acc;
  }, {});

  // Filter categories to only include Men, Shoes and Accessories
  const filteredCategories = Object.entries(groupedProducts).filter(
    ([category]) => ["men", "shoes", "accessories"].includes(category)
  );

  // Auto-rotate carousel
  useEffect(() => {
    if (carouselProducts.length > 0) {
      const interval = setInterval(() => {
        setSelectedCarouselIndex((prev) => 
          prev === carouselProducts.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselProducts.length]);

  // Features data
  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Trending Styles",
      description: "Stay ahead with the latest streetwear trends"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "Get your orders delivered within 2-3 business days"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Quality Assured",
      description: "Premium materials and craftsmanship guaranteed"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Shipping",
      description: "Free shipping on orders above ₹999"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-purple-900/20"
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 10 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo and Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center mb-8"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src="/favicon - Copy.PNG" 
                  alt="XATUN Logo" 
                  className="w-16 h-16 md:w-20 md:h-20"
                />
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <motion.h1
                className="text-6xl md:text-8xl font-black tracking-tight text-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                XATUN
              </motion.h1>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Discover the essence of streetwear culture. Premium quality, bold designs, and authentic style that defines your individuality.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for products, styles, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-32 py-4 text-lg bg-background/80 backdrop-blur-md border-2 border-primary/20 focus:border-primary transition-all duration-300 rounded-full"
              />
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8"
              >
                Search
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              variant="default"
              onClick={() => router.push("/men")}
              className="px-8 py-4 text-lg rounded-full"
            >
              Shop Men's Collection
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/shoes")}
              className="px-8 py-4 text-lg rounded-full"
            >
              Explore Footwear
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-primary rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
     

      {/* Product Carousel */}
      {carouselProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-primary/5 to-purple-900/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Featured Collection
              </h2>
              <p className="text-xl text-muted-foreground">
                Discover our handpicked selection of trending styles
              </p>
            </motion.div>

            <div className="relative">
              <div className="flex justify-center items-center">
                {carouselProducts.map((item, index) => {
                  const isSelected = index === selectedCarouselIndex;
                  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                  const angle = (index - selectedCarouselIndex) * (isMobile ? 15 : 20);
                  const distance = isMobile ? 200 : 300;

                  const x = Math.sin((angle * Math.PI) / 180) * distance;
                  const z = Math.cos((angle * Math.PI) / 180) * distance;

                  return (
                    <motion.div
                      key={item._id}
                      className="absolute cursor-pointer"
                      animate={{
                        x: isSelected ? 0 : x,
                        z: isSelected ? 0 : z,
                        scale: isSelected ? 1.2 : 0.8,
                        opacity: isSelected ? 1 : 0.6,
                        filter: isSelected ? "blur(0px)" : "blur(2px)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 60 }}
                      onClick={() => setSelectedCarouselIndex(index)}
                    >
                      <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden border-4 border-white shadow-2xl">
                        <img
                          src={getMainImageUrl(item)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                          >
                            <div className="text-center text-white">
                              <h3 className="font-bold text-sm md:text-base mb-1">
                                {item.name}
                              </h3>
                              <p className="text-xs md:text-sm opacity-90">
                                ₹{item.price}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {carouselProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCarouselIndex(index)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      index === selectedCarouselIndex
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Categories */}
      {filteredCategories.map(([category, types], categoryIndex) => (
        <section
          key={category}
          className={cn(
            "py-20",
            categoryIndex % 2 === 0 
              ? "bg-background" 
              : "bg-muted/30"
          )}
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {getCategoryDisplayName(category)}
              </h2>
              <p className="text-xl text-muted-foreground">
                Explore our curated collection of {getCategoryDisplayName(category).toLowerCase()}
              </p>
            </motion.div>

            {Object.entries(types).map(([type, typeProducts], typeIndex) => (
              <div key={`${category}-${type}`} className="mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: typeIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between mb-8"
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    {getTypeDisplayName(type)}
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/${category}/${type}`)}
                    className="group"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {typeProducts.slice(0, 10).map((product, productIndex) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: productIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <ProductCard
                        product={product}
                        showActions={true}
                        showRating={true}
                        showQuickView={true}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
 <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose XATUN?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering exceptional quality and service that exceeds your expectations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Elevate Your Style?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of fashion-forward individuals who trust XATUN for their streetwear needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/men")}
                className="px-8 py-4 text-lg rounded-full"
              >
                Start Shopping
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/contact")}
                className="px-8 py-4 text-lg rounded-full border-white text-white hover:bg-white hover:text-primary"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}