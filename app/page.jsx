"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaSearchPlus } from "react-icons/fa";
import { motion, useScroll, useTransform } from "framer-motion";
// import ProductModal from "@/components/ProductModal.jsx"; // Import the modal
import { useRouter } from "next/navigation"; // Import useRouter
import ProductCard from "@/components/ProductCard.jsx";

export default function FearlessSoulPage() {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [distance, setDistance] = useState(500);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
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
      }
    }
    fetchProducts();
  }, []);
  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };
  useEffect(() => {
    const handleResize = () => {
      setDistance(window.innerWidth < 768 ? 400 : 500);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const renderProductSection = (category, type, title) => {
    const filteredProducts = products.filter(
      (item) => item.category === category && item.type === type
    );

    if (filteredProducts.length === 0) return null;
  }
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

  // Filter categories to only include Men, shoes and Accessories
  const filteredCategories = Object.entries(groupedProducts).filter(
    ([category]) => ["men", "shoes", "accessories"].includes(category)
  );
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };


  return (
    <>
      <div className="bg-gradient-to-b to-black from-blue-900 min-h-screen text-white overflow-hidden">
        {/* Header Section */}
        <header className="main-ha text-center pt-10">
          <div className="flex justify-center  mt-40 items-center">
            <div className="flex mx-3  w-[60px]">
              <img src="/favicon - Copy.PNG" alt="XATUN Logo" />
            </div>
            <motion.h1 className="text-5xl font-extrabold  bg-opacity-35 tracking-wide text-gray-100">XATUN</motion.h1>
          </div>
        </header>
          <form onSubmit={handleSearch} className="pt-[100px] px-[20px] main-ha z-40 flex justify-center">
            <div className="relative flex items-center w-full max-w-md">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-1 py-1 pl-12 text-lg text-white placeholder-gray-300 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-l-full focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all shadow-lg hover:shadow-xl"
              />
              {/* Search Icon */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <FaSearchPlus className="w-5 h-5 text-gray-300" />
              </div>
              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-1 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-r-full hover:bg-white/20 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-lg hover:shadow-xl"
              >
                Search
              </button>
            </div>
          </form>

        {/* Product Carousel Section */}
        <section className="relative main-ha flex justify-center items-center z-30 h-[300px] bg-transparent overflow-hidden">
          <div className="relative h-full flex justify-center items-center">
            {products
              .filter((item) => item.type === "Carouselimg")
              .map((item, index) => {
                // Responsive adjustments
                const isMobile = window.innerWidth < 768;
                const angle = (index - 6 / 2) * (isMobile ? 10 : 15); // Smaller angle for mobile
                const distance = isMobile ? 300 : 700; // Smaller distance for mobile

                const x = Math.sin((angle * Math.PI) / 120) * distance;
                const z = Math.cos((angle * Math.PI) / 180) * distance;

                return (
                  <motion.div
                    key={item._id}
                    onHoverStart={() => setSelectedIndex(index)}
                    onTap={() => setSelectedIndex(index === selectedIndex ? null : index)}
                    onHoverEnd={() => setSelectedIndex(null)}
                    animate={{
                      x: selectedIndex === null ? x : index === selectedIndex ? 0 : x * 0.5,
                      z: selectedIndex === null ? z : index === selectedIndex ? 0 : z * 0.5,
                      scale: selectedIndex === index ? 1.5 : 1,
                      opacity: selectedIndex === null || selectedIndex === index ? 1 : 0,
                      filter:
                        selectedIndex === null || selectedIndex === index
                          ? "blur(0px)"
                          : "blur(4px)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 60 }}
                    className="absolute w-24 h-24 md:w-48 md:h-48 rounded-lg flex items-center justify-center cursor-pointer"
                    style={{ transformOrigin: "center center" }}
                  >
                    <img
                      src={`data:${item.contentType};base64,${item.image}`}
                      alt={`Product ${item.id}`}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                );
              })}
          </div>
        </section>


        <section className="relative  flex justify-center items-center h-[400px] bg-gradient-to-t from-red-500 to-transparent opacity-100">

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
            alt="Angel Statue"
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
          <div className="absolute bottom-[-50px] z-10 flex bg-gradient-to-b to-black via-black from-transparent w-full h-[300px] flex-col items-center justify-center">

          </div>
        </section>
        {filteredCategories.map(([category, types]) => (
          <section key={category} className="bg-gradient-to-b  to-black via-blue-800 from-black min-h-screen relative md:mt-[0px] z-50">
            <h1 className="text-4xl font-bold text-center pt-0">{category.toUpperCase()}</h1>
            {Object.entries(types).map(([type, products]) => (
              <div key={`${category}-${type}`}>
                <div className="p-4 md:p-9 pb-0">
                  <h1 className="font-semibold text-xl md:text-2xl p-4">{type.toUpperCase()}</h1>
                </div>
                {/* Grid layout for products */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-0 p-0 md:p-0">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="w-full h-auto cursor-pointer"
                      onClick={() => handleProductClick(product.itemId)}
                    >
                      <ProductCard
                        id={product.itemId}
                        title={product.name}
                        price={product.price}
                        imageUrl={`data:${product.contentType};base64,${product.image}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}

      </div>

    </>
  );
}