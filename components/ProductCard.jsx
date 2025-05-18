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
    <div className="mb-10 relative h-[280px] hover:scale-125 transition-all delay-150 max-w-sm w-[180px] bg-blue-800 bg-opacity-15 rounded-lg shadow-blue-700 shadow-xl overflow-hidden">
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
          className="h-[200px] bg-opacity-0 delay-100 bg-slate-50 flex justify-center w-[200px]  rounded-lg object-cover"
        />
      </motion.div>
      <div>

        <div className=" items-center justify-between relative m-4">
          <h2 className="text-base justify-between items-center text-[12px]  text-white font-thin">{title}</h2>
          <h2></h2>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;