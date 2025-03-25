"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddressForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zip) newErrors.zip = "Zip code is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Save address to local storage
    localStorage.setItem("userAddress", JSON.stringify(formData));

    // Redirect back or to the checkout page
    router.back(); // or router.back() to go to the previous page
  };
  // const customerDetails = JSON.parse(localStorage.getItem("userAddress"));

  return (
    <div className="min-h-screen md:pt-10 pt-[80px]  bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Enter Your Address</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              // value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 ${
                errors.name ? "border border-red-500" : ""
              }`}
              // placeholder={customerDetails.name}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label htmlFor="address" className="block text-lg font-medium mb-2">
              Full Address
            </label>
            <textarea
              id="address"
              name="address"
              // value={formData.address}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 ${errors.address ? "border border-red-500" : ""
                }`}
              rows="4"
              // placeholder={customerDetails.address}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* City Field */}
          <div>
            <label htmlFor="city" className="block text-lg font-medium mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              // value={formData.city}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 ${errors.city ? "border border-red-500" : ""
                }`}
              // placeholder={customerDetails.city}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* State Field */}
          <div>
            <label htmlFor="state" className="block text-lg font-medium mb-2">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              // value={formData.state}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 ${errors.state ? "border border-red-500" : ""
                }`}
              // placeholder={customerDetails.state}
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>

          {/* Zip Code Field */}
          <div>
            <label htmlFor="zip" className="block text-lg font-medium mb-2">
              Zip Code
            </label>
            <input
              type="text"
              id="zip"
              name="zip"
              // value={formData.zip}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 ${errors.zip ? "border border-red-500" : ""
                }`}
              // placeholder={customerDetails.zip}
            />
            {errors.zip && (
              <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phone" className="block text-lg font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              // value={formData.phone}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 ${errors.phone ? "border border-red-500" : ""
                }`}
              // placeholder={customerDetails.phone}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
}