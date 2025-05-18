"use client";
import { motion } from "framer-motion";

export default function Carousel({ products, selectedIndex, setSelectedIndex, distance }) {
  return (
    <div className="relative  h-full flex justify-center bg-transparent items-center">
      {products.map((product, index) => {
        const angle = (index - products.length / 2) * 15; // Angle for positioning
        const x = Math.sin((angle * Math.PI) / 180) * distance; // X position
        const z = Math.cos((angle * Math.PI) / 180) * distance; // Z position

        return (
          <motion.div
            key={product._id}
            onHoverStart={() => setSelectedIndex(index)}
            onHoverEnd={() => setSelectedIndex(null)}
            animate={{
              x: selectedIndex === null ? x : index === selectedIndex ? 0 : x * 0.5,
              z: selectedIndex === null ? z : index === selectedIndex ? 0 : z * 0.5,
              scale: selectedIndex === index ? 1.5 : 1,
              opacity: selectedIndex === null || selectedIndex === index ? 1 : 0,
              filter: selectedIndex === null || selectedIndex === index ? "blur(0px)" : "blur(4px)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 60 }}
            className="absolute w-48 h-48 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ transformOrigin: "center center" }}
          >
            <img
              src={`data:${product.contentType};base64,${product.image}`}
              alt={product.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </motion.div>
        );
      })}
    </div>
  );
}