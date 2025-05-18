"use client";
import { setSeconds } from "date-fns";
import React, { useState, useEffect } from "react";

export default function EditPage({ params }) {
  const { itemId } = params; // Destructure itemId from params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setdescription] = useState("");

  // Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${itemId}`);
        const data = await response.json();
        setProduct(data);
        setName(data.name);
        setPrice(data.price);
        setCategory(data.category); // Fetch and set the category
        setdescription(data.description); // Fetch and set the category
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [itemId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/products/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, category, description }), // Include category in the request
      });

      if (response.ok) {
        alert("Product updated successfully!");
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b to-black from-blue-900 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-5 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>

        {/* Item Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Item Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white bg-opacity-15 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Item Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-300">
            Item Price
          </label>
          <input
            type="text"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white bg-opacity-15 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Item description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white bg-opacity-15 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Item Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-300">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select a category</option>
            <option value="men">Men</option>
            <option value="shoes">shoes</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}