"use client";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import { motion } from "framer-motion";
import { getMainImageUrl } from "@/lib/imageUtils";
import { usePageLoading } from "@/hooks/usePageLoading";

export default function ImagesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Use the page loading hook
  usePageLoading();

  // Fetch products from MongoDB
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/images");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert(`Failed to load products: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.itemId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete action
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      setDeleting(true);
      try {
        const response = await fetch(`/api/images/delete?productId=${productId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          const result = await response.json();
          setProducts(products.filter((product) => product._id !== productId));
          alert(result.message || "Product deleted successfully!");
        } else {
          const error = await response.json();
          console.error('Delete failed:', error);
          alert(error.error || "Failed to delete product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product.");
      } finally {
        setDeleting(false);
      }
    }
  };

  // Handle edit action (redirect to edit page)
  const handleEdit = (itemId) => {
    window.location.href = `/edit/${itemId}`; // Redirect to edit page
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b to-black from-blue-900 p-4">
      <div className="max-w-7xl mt-[50px] mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">All Products</h1>

        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by Item ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-4 mr-4 mb-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <a href="/admin/upload">
            <button type="button" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Add a product +
            </button>
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Image Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="hover:scale-105 transition-all delay-150 max-w-sm w-[250px] bg-transparent rounded-lg shadow-blue-900 shadow-xl relative"
              >
                {/* Image */}
                <motion.div
                  className="rounded-lg flex items-center justify-center cursor-pointer"
                  whileHover={{
                    scale: 1.25,      // Similar to hover:scale-125
                    rotate: 5,        // Slight rotation for better feel
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)", // Smooth shadow on hover
                  }}
                  transition={{
                    duration: 0.4,    // Smooth and controlled duration
                    type: "spring",   // More bouncy feel
                    stiffness: 150,   // Adjust stiffness for spring effect
                  }}
                >
                  <img
                    src={getMainImageUrl(product)}
                    alt={product.name || 'Product Image'}
                    className="w-full h-[250px] object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                      e.target.alt = 'Image not available';
                    }}
                  />
                </motion.div>

                {/* Icons on Hover */}
                <div className="absolute top-2 left-2 flex gap-2 opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEdit(product.itemId)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="Edit Product"
                  >
                    <FaEdit className="text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={deleting}
                    className={`p-2 rounded-full shadow-md transition-colors ${
                      deleting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-white hover:bg-red-100'
                    }`}
                    title="Delete Product"
                  >
                    <FaTrash className={`${deleting ? 'text-gray-600' : 'text-red-500'}`} />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-100 mb-2">
                    {product.name || 'Unnamed Product'}
                  </h2>
                  <p className="text-[14px] flex text-green-400 font-thin py-1">
                    ₹{product.price || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-400 mb-1">
                    item-id: <samp className="text-gray-300"> {product.itemId || 'N/A'}</samp>
                  </p>
                  <p className="text-sm text-gray-400 mb-1">
                    ID: {product._id?.toString() || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-400 mb-1">
                    Category: {product.category || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-400 mb-1">
                    Type: {product.type || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {formatDate(product.createdAt)}
                  </p>
                  {product.additionalImages && product.additionalImages.length > 0 && (
                    <p className="text-xs text-blue-400 mt-1">
                      +{product.additionalImages.length} additional images
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Images Found */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center text-gray-600 py-8">
            <p>No products found.</p>
          </div>
        )}

        {/* Delete Loading Overlay */}
        {deleting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700">Deleting product...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}