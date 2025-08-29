"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Lock,
  Shield,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });

  // Load cart from localStorage
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart from localStorage
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart.length > 0) {
            setCartItems(parsedCart);
          }
        } catch (e) {
          console.error('Error parsing cart:', e);
        }
      }
    }
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 199;
  const tax = subtotal * 0.0; // 18% GST
  const total = subtotal + shipping + tax;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear any previous errors
  };

  // Validation
  const isShippingValid = () => {
    return Object.values(shippingInfo).every(value => value.trim() !== "");
  };

  // Navigation
  const nextStep = () => {
    if (currentStep === 1 && isShippingValid()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle Razorpay checkout
  const handleRazorpayCheckout = async () => {
    if (!isShippingValid()) {
      setError("Please fill in all shipping details");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsProcessingPayment(true);
    setError("");

    try {
      // Create Razorpay order
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total ), // Convert to paise
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const order = await response.json();

      if (order.error) {
        throw new Error(order.error);
      }

      // Open Razorpay payment modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_TEST_KEY", // Fallback for development
        amount: order.amount,
        currency: order.currency,
        name: "XATUN Streetwear",
        description: "Premium Streetwear Collection",
        image: "/favicon - Copy.PNG",
        order_id: order.id,
        handler: async function (response) {
          try {
            // Create orders for each cart item
            let allOrdersSuccessful = true;
            const createdOrders = [];
            
            for (const item of cartItems) {
              const orderResponse = await fetch("/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  productName: item.name,
                  itemId: item.id || item.itemId, // Handle both id formats
                  orderId: order.id,
                  amount: item.price,
                  itemImage: item.image,
                  paymentId: response.razorpay_payment_id,
                  address: shippingInfo,
                  size: item.size,
                  quantity: item.quantity,
                  color: item.color
                }),
              });

              if (!orderResponse.ok) {
                throw new Error(`Order creation failed: ${orderResponse.status}`);
              }

              const orderData = await orderResponse.json();
              
              if (!orderData.success) {
                allOrdersSuccessful = false;
                console.error("Order creation failed for item:", item.name);
                break;
              }

              createdOrders.push(orderData.orderId);
            }

            if (allOrdersSuccessful) {
              // Update product stock for all purchased items
              try {
                for (const item of cartItems) {
                  const stockUpdateResponse = await fetch("/api/products/update-stock", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      itemId: item.id || item.itemId,
                      size: item.size,
                      quantity: item.quantity
                    }),
                  });

                  if (!stockUpdateResponse.ok) {
                    console.error(`Stock update failed for item: ${item.name}`);
                    // Don't fail the entire process for stock update issues
                    // Log it for admin review
                  } else {
                    const stockUpdateData = await stockUpdateResponse.json();
                    if (stockUpdateData.success) {
                      console.log(`Stock updated for ${item.name} - ${item.size}: New stock: ${stockUpdateData.newStock}`);
                      toast.success(`Stock updated for ${item.name} - ${item.size}`);
                    }
                  }
                }
              } catch (stockError) {
                console.error("Error updating stock:", stockError);
                // Don't fail the entire process for stock update issues
                // Log it for admin review
              }

              // Show success message for stock updates
              toast.success(`Payment successful! Stock updated for ${cartItems.length} items.`);
              
              // Clear cart and save order IDs to localStorage
              localStorage.removeItem("cart");
              
              // Save order IDs for my-orders page
              const existingOrderIds = JSON.parse(localStorage.getItem('orderIds') || '[]');
              const newOrderIds = [...existingOrderIds, ...createdOrders];
              localStorage.setItem('orderIds', JSON.stringify(newOrderIds));
              
              router.push("/my-orders");
            } else {
              setError("Payment successful, but some orders failed to create. Please contact support.");
            }
          } catch (error) {
            console.error("Error creating orders:", error);
            setError("Payment successful, but order creation failed. Please contact support.");
          }
        },
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        notes: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zipCode,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      setError("Error processing payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const steps = [
    { number: 1, title: "Shipping", icon: <Truck className="w-5 h-5" /> },
    { number: 2, title: "Payment", icon: <CreditCard className="w-5 h-5" /> },
    { number: 3, title: "Review", icon: <CheckCircle className="w-5 h-5" /> }
  ];

  // Show error if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Cart is Empty
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Add some products to your cart before proceeding to checkout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/")}
              className="px-8 py-4 text-lg rounded-full"
            >
              Continue Shopping
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/cart")}
              className="px-8 py-4 text-lg rounded-full"
            >
              View Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-purple-900/10">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
          >
            Checkout
          </motion.h1>
          
          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? "bg-primary border-primary text-white" 
                    : "bg-background border-border text-muted-foreground"
                }`}>
                  {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ${
                    currentStep > step.number ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-800">{error}</span>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-xl border border-border p-8"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Truck className="w-6 h-6 text-primary" />
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        placeholder="Enter first name"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        placeholder="Enter last name"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        placeholder="Enter email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        placeholder="Enter phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        placeholder="Enter address"
                        value={shippingInfo.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <Input 
                      placeholder="Enter city"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <Input 
                      placeholder="Enter state"
                      value={shippingInfo.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                    <Input 
                      placeholder="Enter ZIP code"
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <Input 
                      placeholder="Enter country"
                      value={shippingInfo.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-xl border border-border p-8"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  Payment Method
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-muted/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-semibold">Secure Payment with Razorpay</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Your payment will be processed securely through Razorpay. You can pay using:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Credit/Debit Cards</li>
                      <li>• UPI (Google Pay, PhonePe, Paytm)</li>
                      <li>• Net Banking</li>
                      <li>• Wallets</li>
                    </ul>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">Your payment information is secure and encrypted</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-xl border border-border p-8"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                  Order Review
                </h2>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id || item.itemId} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" width={64} height={64} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                        {item.originalPrice > item.price && (
                          <p className="text-sm text-muted-foreground line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between mb-2 text-green-600">
                        <span>Discount:</span>
                        <span>-₹{totalDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between mb-2">
                      <span>Shipping:</span>
                      <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Tax (GST):</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                      <span>Total:</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold text-foreground mb-3">Shipping Address</h3>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="font-medium text-foreground">
                        {shippingInfo.firstName} {shippingInfo.lastName}
                      </p>
                      <p className="text-muted-foreground">{shippingInfo.address}</p>
                      <p className="text-muted-foreground">
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      </p>
                      <p className="text-muted-foreground">{shippingInfo.country}</p>
                      <p className="text-muted-foreground">{shippingInfo.phone}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-8 py-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button 
                  onClick={nextStep} 
                  disabled={currentStep === 1 && !isShippingValid()}
                  className="px-8 py-3"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleRazorpayCheckout}
                  disabled={isProcessingPayment || !isShippingValid()}
                  className="px-8 py-3"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay ₹{total.toLocaleString()}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Toast Container */}
      <div id="toast-container" />
    </div>
  );
} 