"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import ProductCard from "@/components/ProductCard.jsx";
import Skeleton from "react-loading-skeleton";
import { FaStar } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { StarIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import Confetti from "react-confetti";
import { toast } from "react-toastify";

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
        setSelectedImage(productData.image);
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
    if (!selectedSize) {
      toast.error("Please select a size.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    if (sizeStock === 0) {
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
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = cart.map((item) =>
        item.itemId === product.itemId && item.size === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      if (!cart.some((item) => item.itemId === product.itemId && item.size === selectedSize)) {
        updatedCart.push({ ...product, size: selectedSize, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(`${product.name} (Size: ${selectedSize}) added to cart!`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error updating cart:", error);
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
                itemImage: product.image,
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
        <div className="grid grid-cols-1 mt-[40px] md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <motion.div
              className="relative justify-items-center w-full h-auto rounded-lg shadow-lg overflow-hidden cursor-zoom-in"
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsLightboxOpen(true)}
            >
              <motion.img
                src={`data:${product.contentType};base64,${selectedImage}`}
                alt={product.name}
                className="md:h-[450px] rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
            <AnimatePresence>
              {isLightboxOpen && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsLightboxOpen(false)}
                >
                  <motion.img
                    src={`data:${product.contentType};base64,${selectedImage}`}
                    alt={product.name}
                    className="max-w-full max-h-full rounded-lg"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex p-6 gap-4 overflow-x-auto">
              {[product.image, ...(product.additionalImages || [])].map(
                (img, index) => (
                  <motion.div
                    key={index}
                    className={`w-20 h-20 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${selectedImage === img ? "border-2 border-blue-500" : "border-2 border-transparent"
                      }`}
                    onClick={() => setSelectedImage(img)}
                    whileHover={{ scale: 1.1 }}
                  >
                    <img
                      src={`data:${product.contentType};base64,${img}`}
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </motion.div>
                )
              )}
            </div>
          </div>
          <div className="space-y-8 ">
            {/* Product Name */}
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {product.name}
            </motion.h1>

            {/* Category */}
            <motion.p
              className="text-lg text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="font-semibold text-white">Category:</span> {product.category}
            </motion.p>

            {/* Price */}
            <motion.p
              className="text-2xl font-bold  flex items-center space-x-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <span className="text-green-400">₹</span>
              <span>{product.price}</span>
            </motion.p>

            {/* Description */}
            <motion.p
              className="text-lg text-gray-400 text-[12px] leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {product.description}
            </motion.p>

            {/* Size Selection */}
            <motion.div
              className="text-lg text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <span className="font-semibold text-white">Select Size:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((sizeObj) => (
                  <motion.button
                    key={sizeObj.size}
                    onClick={() => handleSizeSelection(sizeObj.size)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all
                      ${selectedSize === sizeObj.size
                        ? "bg-blue-600 text-white shadow-md" // Selected size style
                        : sizeObj.stock === 0
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed" // Out of stock style
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white" // Default style
                      }`}
                    whileHover={{ scale: sizeObj.stock > 0 ? 1.05 : 1 }} // Hover effect only if in stock
                    whileTap={{ scale: sizeObj.stock > 0 ? 0.95 : 1 }} // Tap effect only if in stock
                    disabled={sizeObj.stock === 0} // Disable button if out of stock
                  >
                    {sizeObj.size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Stock Status */}
            <motion.div
              className="text-lg font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <span className={`${sizeStock > 0 ? "text-green-400" : "opacity-0"}`}>
                {sizeStock > 0 ? "✔ In Stock" : "✖ Out of Stock"}
              </span>
            </motion.div>

            {/* Rating */}
            <motion.div
              className="flex items-center space-x-2 text-lg text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span className="font-semibold text-white">Rating:</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`h-5 w-5 transition-all duration-300 ${index < Math.round(averageRating)
                      ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(255,223,0,0.8)]"
                      : "text-gray-600"
                      }`}
                  />
                ))}
              </div>
              <span className="text-white">{averageRating} ({totalRatings} ratings)</span>
            </motion.div>

            {/* Rate this Product */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <span className="text-lg font-semibold text-white">Rate this product:</span>
              {hasRated ? (
                <p className="text-gray-400">You’ve already rated (<span className="text-white">5% off</span>) this product.</p>
              ) : (
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className="p-1"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={hasRated}
                    >
                      <StarIcon
                        className={`h-5 w-5 transition-all duration-300 ${star <= rating
                          ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(255,223,0,0.8)]"
                          : "text-gray-600"
                          }`}
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-4">
              {/* Add to Cart */}
              <motion.button
                onClick={() => addToCart(product)}
                className="bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 
                    hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-500/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                disabled={!selectedSize || sizeStock === 0}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Add to Cart</span>
              </motion.button>

              {/* Buy Now */}
              <motion.button
                onClick={() => {
                  if (sizeStock <= 0) {
                    // Trigger shake animation
                    controls.start("shake");

                    // Show toast notification
                    toast.warn("Select a Size.", {
                      position: "bottom-right",
                      autoClose: 3000,
                    });
                  } else {
                    toast.success("Processing", {
                      position: "bottom-right",
                      autoClose: 3000,
                    });
                    buyNow(product); // Proceed with the purchase
                  }
                }}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 
                    hover:bg-green-500 transition-all shadow-md hover:shadow-green-500/50"
                whileHover={{ scale: sizeStock > 0 ? 1.05 : 1 }} // Hover effect only if in stock
                whileTap={{ scale: sizeStock > 0 ? 0.95 : 1 }} // Tap effect only if in stock
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                // disabled={!selectedSize || sizeStock === 0} // Disable button if no size is selected or out of stock
                variants={shakeAnimation} // Shake animation
                animate={controls} // Animation controls
              >
                <span>Buy Now</span>
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
                title={product.name}
                price={product.price}
                imageUrl={`data:${product.contentType};base64,${product.image}`}
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