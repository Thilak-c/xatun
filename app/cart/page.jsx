"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  ArrowRight, 
  Trash2, 
  Plus, 
  Minus,
  Heart,
  Eye,
  CreditCard,
  Truck,
  Shield,
  Lock,
  X,
  Package,
  Clock,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPrice, getMainImageUrl } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Real cart data from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart) && parsedCart.length > 0) {
              setCartItems(parsedCart);
            }
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // const totalDiscount = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const totalDiscount =  0

  const shipping = subtotal > 999 ? 0 : 199;
  const tax = subtotal * 0; // 18% GST
  const total = subtotal + shipping + 0;

  // Handle quantity changes
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    // Show notification
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      toast.success(`Updated ${item.name} quantity to ${newQuantity}`);
    }
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      if (updatedCart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        localStorage.removeItem('cart');
      }
    }
    
    // Show notification
    if (item) {
      toast.success(`${item.name} removed from cart`);
    }
  };

  // Move item to wishlist
  const moveToWishlist = (itemId) => {
    try {
      const item = cartItems.find(cartItem => cartItem.id === itemId);
      if (item) {
        // Get existing wishlist or create new one
        const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const updatedWishlist = [...existingWishlist, item];
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        
        // Remove from cart
        removeItem(itemId);
        
        // Show success message
        toast.success(`${item.name} moved to wishlist successfully!`);
      }
    } catch (error) {
      console.error('Error moving item to wishlist:', error);
      toast.error('Failed to move item to wishlist');
    }
  };

  // Apply coupon
  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      // Production-ready coupon validation
      const validCoupons = {
        "WELCOME10": { discount: 0.10, description: "10% off on first order", minAmount: 0 },
        "SAVE20": { discount: 0.20, description: "20% off on orders above ₹2000", minAmount: 2000 },
        "FREESHIP": { discount: 0, description: "Free shipping on any order", minAmount: 0 },
        "SUMMER25": { discount: 0.25, description: "25% off summer collection", minAmount: 1500 }
      };

      const coupon = validCoupons[couponCode.toUpperCase()];
      
      if (coupon) {
        // Check minimum amount requirement
        if (subtotal >= coupon.minAmount) {
          setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
          setShowCouponInput(false);
          setCouponCode("");
          
          // Save applied coupon to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('appliedCoupon', JSON.stringify({ code: couponCode.toUpperCase(), ...coupon }));
          }
          
          toast.success(`Coupon ${couponCode.toUpperCase()} applied successfully!`);
        } else {
          toast.error(`Minimum order amount of ₹${coupon.minAmount} required for this coupon`);
        }
            } else {
        toast.error("Invalid coupon code. Please try again.");
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error("Error applying coupon. Please try again.");
    }
  };

  // Load applied coupon from localStorage on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCoupon = localStorage.getItem('appliedCoupon');
      if (savedCoupon) {
        try {
          const parsedCoupon = JSON.parse(savedCoupon);
          setAppliedCoupon(parsedCoupon);
        } catch (error) {
          console.error('Error parsing saved coupon:', error);
          localStorage.removeItem('appliedCoupon');
        }
      }
    }
  }, []);

  // Calculate coupon discount
  const couponDiscount = appliedCoupon ? 
    (appliedCoupon.discount > 0 ? subtotal * appliedCoupon.discount : 0) : 0;

  // Final total with coupon
  const finalTotal = total - couponDiscount;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
  return (
      <div className="min-h-screen bg-background">
        {/* Empty Cart */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <motion.div
            style={{ y, opacity }}
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-900/10"
          />
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingCart className="w-16 h-16 text-muted-foreground" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Your Cart is Empty
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Looks like you haven't added any items to your cart yet. 
                Start shopping to discover amazing streetwear styles!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => router.push("/")}
                  className="px-8 py-4 text-lg rounded-full"
                >
                  Start Shopping
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/search")}
                  className="px-8 py-4 text-lg rounded-full"
                >
                  Browse Products
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-900/10"
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Shopping Cart
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Review your items and proceed to checkout. {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart.
            </p>
            
            {/* Cart Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-8 text-center"
            >
              <div>
                <div className="text-3xl font-bold text-primary">{cartItems.length}</div>
                <div className="text-muted-foreground">Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{formatPrice(subtotal)}</div>
                <div className="text-muted-foreground">Subtotal</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{formatPrice(totalDiscount)}</div>
                <div className="text-muted-foreground">Savings</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={getMainImageUrl(item)}
                        alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Only show out of stock if the item actually has stock info and it's 0 */}
                        {item.sizes && item.sizes.length > 0 && (
                          (() => {
                            const sizeObj = item.sizes.find(s => s.size === item.size);
                            return sizeObj && sizeObj.stock === 0 ? (
                              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                  Out of Stock
                                </span>
                              </div>
                            ) : null;
                          })()
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Size: {item.size}</span>
                            <span>Color: {item.color}</span>
                          </div>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-primary">
                              {formatPrice(item.price)}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="text-lg text-muted-foreground line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                      </div>
                    </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveToWishlist(item.id)}
                            className="flex items-center gap-2"
                          >
                            <Heart className="w-4 h-4" />
                            Wishlist
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/products/${item.id}`)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-2 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                        Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="sticky top-8"
              >
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Order Summary</h2>

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(totalDiscount)}</span>
                </div>
                    )}
                <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                      </span>
                </div>
                <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (GST)</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon ({appliedCoupon.code})</span>
                        <span>-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>{formatPrice(finalTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Section */}
                  <div className="space-y-3">
                    {!appliedCoupon ? (
                      <Button
                        variant="outline"
                        onClick={() => setShowCouponInput(!showCouponInput)}
                        className="w-full"
                      >
                        Have a coupon?
                      </Button>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-800 font-medium">{appliedCoupon.code}</p>
                            <p className="text-green-600 text-sm">{appliedCoupon.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setAppliedCoupon(null);
                              if (typeof window !== 'undefined') {
                                localStorage.removeItem('appliedCoupon');
                              }
                              toast.success("Coupon removed successfully");
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {showCouponInput && !appliedCoupon && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={applyCoupon}
                            className="flex-1"
                          >
                            Apply
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowCouponInput(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Checkout Button */}
                  <Button
                    size="lg"
                    className="w-full py-4 text-lg rounded-lg"
                    onClick={() => router.push("/checkout")}
                    disabled={cartItems.some(item => {
                      // Check if any item has 0 stock for the selected size
                      if (item.sizes && item.sizes.length > 0) {
                        const sizeObj = item.sizes.find(s => s.size === item.size);
                        return sizeObj && sizeObj.stock === 0;
                      }
                      return false; // If no sizes info, allow checkout
                    })}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>

                  {/* Trust Indicators */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      Secure checkout
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Truck className="w-4 h-4" />
                      Free shipping over ₹999
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4" />
                      30-day returns
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
                </div>
              </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Need Help with Your Order?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Our customer support team is here to help you with any questions about your cart or order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/contact")}
                className="px-8 py-4 text-lg rounded-full"
              >
                Contact Support
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/")}
                className="px-8 py-4 text-lg rounded-full border-white text-white hover:bg-white hover:text-primary"
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
          </div>
      </section>

      {/* Toast Container */}
      <div id="toast-container" />
    </div>
  );
}