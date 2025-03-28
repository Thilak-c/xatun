"use client";
import { useState } from "react";
import { nanoid } from "nanoid";

export default function UploadPage() {
  const [itemId, setItemId] = useState(nanoid(5)); // Generate on component load
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [mainFile, setMainFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [selectedType, setSelectedType] = useState(""); // State for selected type
  const [sizes, setSizes] = useState([]); // Array of sizes with stock
  const [sizeInput, setSizeInput] = useState(""); // Temporary size input
  const [stockInput, setStockInput] = useState(""); // Temporary stock input for the size

  // Define categories
  const categories = [
    { value: "men", label: "Men" },
    { value: "unisex", label: "unisex" },
    { value: "accessories", label: "Accessories" },
  ];

  // Define types based on category
  const getTypesForCategory = (category) => {
    switch (category) {
      case "men":
        return [
          { value: "roundneck-regular-fit-tshirts", label: "ROUNDNECK REGULAR FIT TSHIRTS" },
          { value: "roundneck-oversized-tshirts", label: "ROUNDNECK OVERSIZED TSHIRTS" },
          { value: "polo-tshirts", label: "POLO TSHIRTS" },
          { value: "jerseys", label: "JERSEYS" },
          { value: "denim-jeans", label: "DENIM JEANS" },
          { value: "cargos", label: "CARGOS" },
          { value: "trackpants", label: "TRACKPANTS" },
          { value: "korean-fits", label: "KOREAN FITS" },
        ];
      case "unisex":
        return [
          { value: "roundneck-regular-fit-tshirts", label: "ROUNDNECK REGULAR FIT TSHIRTS" },
          { value: "roundneck-oversized-tshirts", label: "ROUNDNECK OVERSIZED TSHIRTS" },
          { value: "polo-tshirts", label: "POLO TSHIRTS" },
          { value: "jerseys", label: "JERSEYS" },
          { value: "denim-jeans", label: "DENIM JEANS" },
          { value: "cargos", label: "CARGOS" },
          { value: "trackpants", label: "TRACKPANTS" },
          { value: "korean-fits", label: "KOREAN FITS" },
        ];
      case "accessories":
        return [
          { value: "caps", label: "CAPS" },
          { value: "belts", label: "BELTS" },
          { value: "wallets", label: "WALLETS" },
          { value: "perfumes", label: "PERFUMES" },
          { value: "socks", label: "SOCKS" },
        ];
      default:
        return [];
    }
  };

  const [types, setTypes] = useState(getTypesForCategory(selectedCategory));

  const handleMainFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setMainFile(selectedFile);
      setMainImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleAdditionalFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setAdditionalFiles((prev) => [...prev, ...selectedFiles]);
      setAdditionalImagePreviews((prev) => [
        ...prev,
        ...selectedFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const removeAdditionalImage = (index) => {
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setTypes(getTypesForCategory(category)); // Update types based on selected category
    setSelectedType(""); // Reset selected type when category changes
  };

  const addSizeWithStock = () => {
    if (sizeInput && stockInput) {
      setSizes((prev) => [...prev, { size: sizeInput, stock: Number(stockInput) }]);
      setSizeInput("");
      setStockInput("");
    }
  };

  const removeSize = (index) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!mainFile || !itemName || !itemPrice || !itemDescription || !selectedCategory || !selectedType || !sizes.length) {
      setMessage("Please fill out all fields, select a category, select a type, upload the main image, and provide sizes with stock.");
      setLoading(false);
      return;
    }

    try {
      // Convert main image to Base64
      const mainBase64Image = await fileToBase64(mainFile);

      // Convert additional images to Base64
      const additionalBase64Images = await Promise.all(
        additionalFiles.map((file) => fileToBase64(file))
      );

      // Send data to API
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          name: itemName,
          price: Number(itemPrice),
          image: mainBase64Image,
          contentType: mainFile.type,
          additionalImages: additionalBase64Images,
          description: itemDescription,
          category: selectedCategory,
          type: selectedType,
          sizes, // Include sizes with stock
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Product uploaded successfully!");
        setItemId(nanoid(4)); // Generate a new ID for next upload
        setItemName("");
        setItemPrice("");
        setMainFile(null);
        setMainImagePreview("");
        setAdditionalFiles([]);
        setItemDescription("");
        setAdditionalImagePreviews([]);
        setSelectedCategory(""); // Reset category
        setSelectedType(""); // Reset type
        setSizes([]); // Reset sizes
      } else {
        setMessage(result.error || "Failed to upload product.");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      setMessage("An error occurred while uploading the product.");
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b to-black from-blue-900 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-5 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload Product</h1>

        {/* Item ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Item ID (Auto-generated)</label>
          <input
            type="text"
            value={itemId}
            readOnly
            className="mt-1 block w-full px-3 py-2 border bg-opacity-15 border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Item Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white bg-opacity-15 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Item Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Item Price</label>
          <input
            type="number"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white bg-opacity-15 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Item Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Item Description</label>
          <input
            type="text"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white bg-opacity-15 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Category</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled className="text-gray-400">Select a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value} className="bg-gray-800 text-gray-300">
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled className="text-gray-400">Select a type</option>
            {types.map((type) => (
              <option key={type.value} value={type.value} className="bg-gray-800 text-gray-300">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Size and Stock Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Sizes and Stock</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 bg-white bg-opacity-15 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Size (e.g., S)"
            />
            <input
              type="number"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white bg-opacity-15 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Stock"
            />
            <button
              type="button"
              onClick={addSizeWithStock}
              className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          {/* Display added sizes with stock */}
          <div className="mt-2">
            {sizes.map((size, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded-md mb-1">
                <span className="text-gray-300">{size.size} - {size.stock} pcs</span>
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300">Main Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          {mainImagePreview && (
            <div className="mt-4 flex justify-center">
              <img src={mainImagePreview} alt="Main Preview" className="max-h-32 rounded-lg shadow-md" />
            </div>
          )}
        </div>

        {/* Additional Images Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300">Additional Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalFilesChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {/* Preview additional images */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {additionalImagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img src={preview} alt={`Additional ${index + 1}`} className="h-20 rounded-md shadow-md" />
                <button
                  type="button"
                  onClick={() => removeAdditionalImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>

        {/* Message */}
        {message && <p className={`mt-4 text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
      </form>
    </div>
  );
}