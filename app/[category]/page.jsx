"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams, useRouter } from "next/navigation";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`/api/products?category=${category}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);
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

  // Filter categories to only include Men, shoesand Accessories
  const filteredCategories = Object.entries(groupedProducts).filter(
    ([category]) => ["men", "shoes", "accessories"].includes(category)
  );

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white p-4 md:p-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            {category.charAt(0).toUpperCase() + category.slice(1)} Collection
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
              <Skeleton key={index} height={300} className="rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <p className="text-white text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b pt-[100px] md:pt-[50px] from-gray-900 to-black min-h-screen text-white p-0 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          {category.charAt(0).toUpperCase() + category.slice(1)} Collection
        </h1>

        {filteredCategories.map(([category, types]) => (
          <section key={category} className="bg-gradient-to-b  min-h-screen relative md:mt-[0px] z-40">
            {/* <h1 className="text-4xl font-bold text-center mt-10">{category}</h1> */}
            {Object.entries(types).map(([type, products]) => (
              <div key={`${category}-${type}`}>
                <div className="p-4 md:p-9 pb-0"> 
                  <h1 className="font-semibold text-xl md:text-2xl">{type.toUpperCase()}</h1>
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
    </div>
  );
}