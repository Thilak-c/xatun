"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import ProductCard from "@/components/ProductCard.jsx";
import { ShoppingCart, Star, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { StarIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import { getMainImageUrl, getAdditionalImageUrls } from "@/lib/imageUtils";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(""); // Selected size
  const [sizeStock, setSizeStock] = useState(0); // Stock for selected size
  const controls = useAnimation(); // Animation controls

  // Shake animation
  const shakeAnimation = {
    shake: {
      x: [0, -10, 10, -10, 10, 0], // Keyframes for shake effect
      transition: {
        duration: 0.5, // Duration of the shake animation
      },
    },
  };

  // Handle star rating click
  const handleStarClick = async (starRating) => {
    setRating(starRating);
    
    try {
      // Submit rating to API
      const response = await fetch(`/api/products/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: starRating }),
      });

      if (response.ok) {
        setHasRated(true);
        localStorage.setItem(`rated_${id}`, 'true');
        
        // Update average rating
        const data = await response.json();
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
        
        toast.success('Rating submitted successfully! You get 5% off!', {
          position: "bottom-right",
          autoClose: 3000,
        });
        
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        toast.error('Failed to submit rating. Please try again.', {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // Handle product click for navigation
  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  // Check if the user has already rated the product
  useEffect(() => {
    const rated = localStorage.getItem(`rated_${id}`);
    if (rated) {
      setHasRated(true);
    }
  }, [id]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch product details
  useEffect(() => {
    async function fetchData() {
      try {
        const productResponse = await fetch(`/api/products/${id}`);
        const productData = await productResponse.json();
        setProduct(productData);
        
        // Set initial selected image to main image
        const mainImage = getMainImageUrl(productData);
        setSelectedImage(mainImage);
        setAverageRating(productData.averageRating || 0);

        if (productData.ratings && Array.isArray(productData.ratings)) {
          setTotalRatings(productData.ratings.length);
        }

        // Fetch related products by category
        const relatedResponse = await fetch(`/api/products?category=${productData.category}`);
        const relatedData = await relatedResponse.json();
        setRelatedProducts(relatedData.filter(p => p.itemId !== productData.itemId).slice(0, 4));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // Handle size selection
  const handleSizeSelection = (size) => {
    setSelectedSize(size);
    const selectedSizeObj = product.sizes.find((s) => s.size === size);
    if (selectedSizeObj) {
      setSizeStock(selectedSizeObj.stock);
      if (selectedSizeObj.stock === 0) {
        toast.warn(`Size ${size} is out of stock.`, {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    }
  };

  // Add to cart
  const addToCart = (product) => {
    console.log("Add to Cart clicked. Selected size:", selectedSize, "Size stock:", sizeStock);
  
    if (!selectedSize) {
      console.log("No size selected.");
      toast.error("Please select a size.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
  
    if (sizeStock === 0) {
      console.log("Selected size is out of stock.");
      toast.warn(`Size ${selectedSize} is out of stock.`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
  
    const userAddress = localStorage.getItem("userAddress");
    console.log("User address from localStorage:", userAddress);
  
    if (!userAddress) {
      console.log("No user address found. Redirecting to /address.");
      router.push("/address");
      return;
    }
  
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      console.log("Current cart:", cart);
  
      // Check if item already exists in cart with same size
      const existingItemIndex = cart.findIndex(
        (item) => item.itemId === product.itemId && item.size === selectedSize
      );
  
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        cart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        cart.push({ 
          ...product, 
          size: selectedSize, 
          quantity: 1,
          image: getMainImageUrl(product) // Ensure image is included
        });
      }
  
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Updated cart:", cart);
  
      toast.success(`${product.name} (Size: ${selectedSize}) added to cart!`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      
      // Show success toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to add to cart. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // Buy now
  const buyNow = async (product) => {
    if (!selectedSize) {
      toast.error("Please select a size.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    if (sizeStock === 0) {
      // Trigger shake animation
      controls.start("shake");

      // Show toast notification
      toast.warn(`Size ${selectedSize} is out of stock.`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const userAddress = localStorage.getItem("userAddress");

    if (!userAddress) {
      router.push("/address");
      return;
    }

    try {
      // Create a Razorpay order
      const customerDetails = JSON.parse(localStorage.getItem("userAddress"));
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: product.price,
          currency: 'INR',
          receipt: `receipt_${product.itemId}`,
        }),
      });

      const order = await response.json();

      if (order.error) {
        throw new Error(order.error);
      }

      // Open Razorpay payment modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Xatun",
        description: "Purchase Description",
        image: "/favicon.ico",
        order_id: order.id,
        handler: async function (response) {
          // Handle successful payment
          console.log(response);

          // Fetch address from localStorage
          const address = JSON.parse(localStorage.getItem("userAddress")) || {};

          // Create order in MongoDB
          try {
            const orderResponse = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                productName: product.name,
                amount: product.price,
                paymentId: response.razorpay_payment_id,
                itemId: product.itemId,
                itemImage: getMainImageUrl(product),
                size: selectedSize,
                address,
              }),
            });

            const orderData = await orderResponse.json();

            if (orderData.success) {
              // Reduce stock for the selected size
              const stockUpdateResponse = await fetch(
                `/api/products/${product.itemId}/update-stock`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    size: selectedSize,
                    quantity: 1, // Assuming the user buys 1 item
                  }),
                }
              );

              const stockUpdateData = await stockUpdateResponse.json();

              if (stockUpdateData.message === "Stock updated successfully.") {
                // Save only the order ID to localStorage
                const userOrders = JSON.parse(localStorage.getItem("userOrders")) || [];
                userOrders.push({ orderId: orderData.orderId });
                localStorage.setItem("userOrders", JSON.stringify(userOrders));

                toast.success(`Payment successful! Order ID: ${orderData.orderId}`, {
                  position: "bottom-right",
                  autoClose: 3000,
                });
                router.push("/my-orders");
              } else {
                toast.error('Payment successful, but stock update failed. Please contact support.', {
                  position: "bottom-right",
                  autoClose: 3000,
                });
              }
            } else {
              toast.error('Payment successful, but order creation failed. Please contact support.', {
                position: "bottom-right",
                autoClose: 3000,
              });
            }
          } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Payment successful, but order creation failed. Please contact support.', {
              position: "bottom-right",
              autoClose: 3000,
            });
          }
        },
        prefill: {
          name: customerDetails.name,
          email: "customer@example.com",
          contact: customerDetails.phone,
        },
        notes: {
          address: customerDetails.address,
          city: customerDetails.city,
          state: customerDetails.state,
          zip: customerDetails.zip,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      toast.error("Error processing payment. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skeleton height={400} className="rounded-lg" />
              <div className="flex gap-4 mt-4">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} width={80} height={80} className="rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton height={40} width={200} />
              <Skeleton height={30} width={100} />
              <Skeleton height={100} />
              <Skeleton height={50} width={150} />
            </div>
          </div>
          <div className="mt-16">
            <Skeleton height={30} width={200} className="mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((_, index) => (
                <Skeleton key={index} height={300} className="rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <p className="text-white text-xl">Product not found.</p>
      </div>
    );
  }

  // Get all images for the product
  const allImages = [getMainImageUrl(product), ...getAdditionalImageUrls(product)].filter(Boolean);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white md:p-12">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={2000}
          numberOfPieces={300}
          gravity={0.1}
          wind={0.01}
          colors={['#FFD700', '#FF69B4', '#00FFFF', '#FF4500', '#7CFC00']}
        />
      )}
       <div className="max-w-7xl p-6 mx-auto">
      <div className="grid grid-cols-1 mt-10 md:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN - Product Images */}
        <div className="md:space-y-6">
          {/* Main Image */}
          <motion.div
            className="relative w-full h-auto rounded-2xl shadow-xl overflow-hidden cursor-zoom-in group"
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image
              src={selectedImage || getMainImageUrl(product)}
              alt={product.name}
              width={800}
              height={800}
              className="rounded-2xl object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white font-semibold text-lg">
              Click to Zoom
            </div>
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {isLightboxOpen && (
              <motion.div
                className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="absolute top-6 right-6 text-white bg-white/20 rounded-full p-2 hover:bg-white/40 transition"
                >
                  <X className="w-6 h-6" />
                </button>
                <motion.img
                  src={selectedImage || getMainImageUrl(product)}
                  alt={product.name}
                  className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thumbnail Gallery */}
          {allImages?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto py-3">
              {allImages.map((img, index) => (
                <motion.div
                  key={index}
                  className={`w-20 h-20 rounded-lg cursor-pointer transition-all ${
                    selectedImage === img
                      ? "ring-2 ring-blue-500 scale-105"
                      : "ring-1 ring-gray-700 hover:ring-blue-400"
                  }`}
                  onClick={() => setSelectedImage(img)}
                  whileHover={{ scale: 1.1 }}
                >
                  <Image
                    src={img}
                    alt={`Product Image ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full rounded-lg object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Product Info */}
        <div className="space-y-6 font-poppins">
          {/* Name */}
          <motion.h1
            className="text-3xl md:text-5xl font-extrabold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {product.name}
          </motion.h1>

          {/* Price */}
          <motion.div
            className="flex items-baseline gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-2xl font-bold text-green-400">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-gray-500 line-through">₹{product.oldPrice}</span>
            )}
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-gray-400 leading-relaxed text-sm md:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {product.description}
          </motion.p>

          {/* Sizes */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="font-semibold text-white">Select Size:</span>
            {!product.sizes || product.sizes.length === 0 ? (
              <p className="text-red-400 text-sm">No sizes available for this product</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sizeObj) => (
                  <motion.button
                    key={sizeObj.size}
                    onClick={() => handleSizeSelection(sizeObj.size)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                      ${selectedSize === sizeObj.size
                        ? "bg-blue-600 text-white shadow-lg"
                        : sizeObj.stock === 0
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    whileHover={{ scale: sizeObj.stock > 0 ? 1.05 : 1 }}
                    whileTap={{ scale: sizeObj.stock > 0 ? 0.95 : 1 }}
                    disabled={sizeObj.stock === 0}
                  >
                    {sizeObj.size}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Stock */}
          {/* Stock Status */}
<motion.p
  className="font-semibold"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5 }}
>
  {!selectedSize ? (
    <span className="text-white">⚠ Please select a size</span>
  ) : sizeStock > 0 ? (
    <span className="text-green-400">✔ In Stock</span>
  ) : (
    <span className="text-red-500">✖ Out of Stock</span>
  )}
</motion.p>


          {/* Rating */}
          <motion.div
            className="flex items-center gap-2 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-white font-semibold">Rating:</span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-600"}`}
              />
            ))}
            <span className="text-sm text-gray-400">
              {averageRating} ({totalRatings} ratings)
            </span>
          </motion.div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              onClick={() => addToCart(product)}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition ${
                !selectedSize || sizeStock === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-600 text-white hover:shadow-blue-500/50"
              }`}
              whileHover={{ scale: !selectedSize || sizeStock === 0 ? 1 : 1.05 }}
              whileTap={{ scale: !selectedSize || sizeStock === 0 ? 1 : 0.95 }}
              disabled={!selectedSize || sizeStock === 0}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </motion.button>

            <motion.button
              onClick={() => buyNow(product)}
              className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition ${
                !selectedSize || sizeStock === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500 text-white hover:shadow-green-500/50"
              }`}
              whileHover={{ scale: !selectedSize || sizeStock === 0 ? 1 : 1.05 }}
              whileTap={{ scale: !selectedSize || sizeStock === 0 ? 1 : 0.95 }}
              disabled={!selectedSize || sizeStock === 0}
              variants={shakeAnimation}
              animate={controls}
            >
              Buy Now
            </motion.button>
          </div>
        </div>
      </div>
    </div>
      <div className="relative mt-16">
        <h2 className="text-3xl flex justify-center font-bold mb-8">Related Products</h2>
        <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-0 p-0 md:p-0">
          {products.filter((item) => item.category === product.category).map((product) => (
            <div
              key={product.itemId} // Use itemId as the key
              className="w-full h-auto cursor-pointer"
              onClick={() => handleProductClick(product.itemId)}
            >
              <ProductCard
                id={product.itemId}
                name={product.name}
                price={product.price}
                imageUrl={getMainImageUrl(product)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-8 right-8 bg-blue-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <a className="flex gap-2" href="/cart">
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Item added to cart!</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}