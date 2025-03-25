"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Load cart from local storage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(savedCart);
    }
  }, []);

  // Update local storage whenever the cart changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Remove an item from the cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    setCart(updatedCart);
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Handle checkout with Razorpay
  const handleCheckout = async () => {
    try {
      // Fetch customer details from localStorage
      const customerDetails = JSON.parse(localStorage.getItem("userAddress")) || {};

      // Create a Razorpay order
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice * 100, // Convert to paise (INR)
          currency: "INR",
          receipt: `receipt_${Date.now()}`, // Unique receipt ID
        }),
      });

      const order = await response.json();

      if (order.error) {
        throw new Error(order.error);
      }

      // Open Razorpay payment modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount, // Amount in paise
        currency: order.currency,
        name: "Your Company Name",
        description: "Purchase Description",
        image: "/favicon.ico", // URL of your company logo
        order_id: order.id,
        handler: async function (response) {
          // Handle successful payment
          console.log(response);

          // Fetch address from localStorage
          const address = JSON.parse(localStorage.getItem("userAddress")) || {};

          // Loop through each product in the cart and post data one by one
          try {
            for (const item of cart) {
              const orderResponse = await fetch("/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  productName: item.name,
                  itemId: item.itemId,
                  orderId: order.id,
                  amount: Number(item.price), // Ensure it's a number
                  itemImage: item.image, // Ensure this is a valid base64 string or URL
                  paymentId: response.razorpay_payment_id,
                  address, // Ensure this is a valid object
                }),
              });

              const orderData = await orderResponse.json();

              // Save order ID to localStorage
              const userOrders = JSON.parse(localStorage.getItem("userOrders")) || [];
              userOrders.push({ orderId: orderData.orderId });
              localStorage.setItem("userOrders", JSON.stringify(userOrders));
            }

            // Clear the cart after successful payment
            clearCart();

            router.push("/my-orders");
          } catch (error) {
            console.error("Error creating orders:", error);
            alert("Payment successful, but order creation failed. Please contact support.");
          }
        },
        prefill: {
          name: customerDetails.name, // Use name from localStorage
          email: "customer@example.com", // Replace with actual email if available
          contact: customerDetails.phone, // Use phone from localStorage
        },
        notes: {
          address: customerDetails.address, // Use address from localStorage
          city: customerDetails.city, // Use city from localStorage
          state: customerDetails.state, // Use state from localStorage
          zip: customerDetails.zip, // Use zip from localStorage
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 to-black min-h-screen text-white p-4 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center md:text-left">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-gray-300">Your cart is empty.</p>
            <Link
              href="/products"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="col-span-2 space-y-6">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item._id}
                    className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-800 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-6">
                      <img
                        src={`data:${item.contentType};base64,${item.image}`}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = "/fallback-image.png"; // Fallback image if the original fails to load
                        }}
                      />
                      <div>
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="text-gray-300">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                        className="w-16 p-2 bg-gray-700 text-white rounded-lg text-center"
                      />
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                onClick={clearCart}
                className="mt-6 w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="fixed bottom-0 left-0 right-0 md:static md:col-span-1 bg-gray-800 p-6 rounded-t-lg md:rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Shipping</span>
                  <span className="font-semibold">₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tax</span>
                  <span className="font-semibold">₹0.00</span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-4">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-xl font-bold">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}