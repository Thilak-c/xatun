"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa"; // Import the star icon from react-icons

const ProductCard = ({ title, price, id, imageUrl }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const productResponse = await fetch(`/api/products/${id}`);
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product data");
        }
        const productData = await productResponse.json();
        setAverageRating(productData.averageRating || 0);

        if (productData.ratings && Array.isArray(productData.ratings)) {
          setTotalRatings(productData.ratings.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [id]);

  return (
    <div className="mb-10 relative h-[350px] hover:scale-125 transition-all delay-150 max-w-sm w-[250px] bg-blue-800 bg-opacity-15 rounded-lg shadow-blue-700 shadow-xl overflow-hidden">
      <motion.div
        className="rounded-lg flex items-center justify-center cursor-pointer"
        whileHover={{
          scale: 1.25,
          rotate: 5,
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
        }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 150,
        }}
      >
        <motion.img
          src={imageUrl}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          alt={title}
          className="h-[250px] bg-opacity-0 delay-100 bg-slate-50 flex justify-center w-[250px] rounded-lg object-cover"
        />
      </motion.div>
      <div>

        <div className="flex items-center justify-between relative m-4">
          <h2 className="text-base justify-between items-center  text-white font-thin">{title}</h2>
          <h2></h2>
          <motion.div
            className="text-lg flex text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`h-4 w-4 transition-all duration-300 ${index < Math.round(averageRating)
                        ? "text-br-400 filter drop-shadow-[0_0_8px_rgba(255,223,0,0.8)]" // Glow effect for active stars
                        : "text-gray-400"
                      }`}
                  />
                ))}
              </div>
              <span className="text-12px">{averageRating}</span>
            </div>
          </motion.div>
        </div>
        <h2 className="m-4"><samp className="text-green-500 m-2 font-bold">₹</samp>{price} <samp className="text-2xl text-gray-600">.</samp> <samp className="line-through text-red-400">₹ {(1.2*price).toFixed(2)}</samp></h2>
      </div>
    </div>
  );
};

export default ProductCard;