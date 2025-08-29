"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import Carousel from "@/components/Carousel";
import { getMainImageUrl } from "@/lib/imageUtils";

export default function FearlessSoulPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [distance, setDistance] = useState(500);
  const [loading, setLoading] = useState(true);

  // Fetch products from MongoDB
  const [products, setProducts] = useState([]);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Handle window resize for carousel
  useEffect(() => {
    const handleResize = () => {
      setDistance(window.innerWidth < 768 ? 200 : 500);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-b from-blue-900 via-purple-900 to-black min-h-screen text-white overflow-hidden">
      {/* Header Section */}
      <header className="text-center py-10">
        <div className="flex justify-center mt-40 items-center">
          <div className="flex mx-3 w-[50px]">
            <img src="/favicon.ico" alt="XATUN Logo" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-wide text-gray-100">XATUN</h1>
        </div>
      </header>

      {/* Carousel Section */}
      <section className="relative flex justify-center items-center z-30 h-[300px] bg-transparent overflow-hidden">
        <Carousel
          products={products}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          distance={distance}
        />
      </section>

      {/* Main Section */}
      <section className="relative flex justify-center items-center h-[400px] bg-gradient-to-t from-red-500 to-transparent opacity-100">
        <motion.img
          src="/img/angel-statue.png"
          alt="Angel Statue"
          className="absolute bottom-0 z-40 w-64 h-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 4 }}
        />
        <motion.img
          src="/img/cloud.png"
          alt="Cloud"
          className="absolute bottom-[-100px] z-0 w-[1800px] h-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 4 }}
        />
        <motion.h2
          className="md:text-8xl text-6xl mb-[180px] z-30 font-extrabold text-red-600 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 2 }}
        >
          ORIGINALS
        </motion.h2>
      </section>

      {/* Featured Products Section */}
      <section className="bg-black mt-[100px] md:mt-[0px] z-50 min-h-screen">
        <div className="p-4 md:p-9 pb-0">
          <h1 className="font-semibold text-xl md:text-2xl">Featured</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-10">
          {products.map((product) => (
            <div key={product._id} className="w-full transform transition-transform duration-300 hover:scale-105">
              <ProductCard
                name={product.name}
                price={product.price}
                imageUrl={getMainImageUrl(product)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}