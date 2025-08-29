'use client'; // Mark as a Client Component

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getMainImageUrl } from "@/lib/imageUtils";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Fetch order details and messages for each order ID in localStorage
  const fetchOrders = async () => {
    try {
      const orderIds = JSON.parse(localStorage.getItem('orderIds')) || [];
      console.log("Order IDs from localStorage:", orderIds);
      
      if (orderIds.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const orderDetails = await Promise.all(
        orderIds.map(async (orderId) => {
          try {
            // Fetch order details
            const orderResponse = await fetch(`/api/orders/${orderId}`);
            if (!orderResponse.ok) {
              console.error(`Failed to fetch order ${orderId}:`, orderResponse.status);
              // Return a fallback order object with basic info
              return {
                orderId: orderId,
                productName: 'Order Details Unavailable',
                amount: 'N/A',
                status: 'pending',
                createdAt: new Date().toISOString(),
                messages: [],
                error: 'API fetch failed'
              };
            }
            const orderData = await orderResponse.json();

            // Fetch messages for the order
            const messagesResponse = await fetch(`/api/orders/${orderId}/messages`);
            let messagesData = [];
            if (messagesResponse.ok) {
              messagesData = await messagesResponse.json();
            } else {
              console.warn(`Failed to fetch messages for order ${orderId}`);
            }

            // Combine order details and messages
            return { ...orderData, messages: messagesData };
          } catch (error) {
            console.error(`Error processing order ${orderId}:`, error);
            // Return a fallback order object
            return {
              orderId: orderId,
              productName: 'Order Details Unavailable',
              amount: 'N/A',
              status: 'pending',
              createdAt: new Date().toISOString(),
              messages: [],
              error: 'Network error'
            };
          }
        })
      );

      // Filter out completely failed orders and show available ones
      const validOrders = orderDetails.filter(order => order !== null);
      console.log("Orders loaded (including fallbacks):", validOrders);
      setOrders(validOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">
        Error: {error}
      </div>
    );
  }

  // No orders found
  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400">
        <div className="text-center">
          <p className="text-xl mb-4">No orders found.</p>
          <p className="text-sm text-gray-500">Your order history will appear here after you make a purchase.</p>
        </div>
      </div>
    );
  }

  // Helper function to get order image
  const getOrderImage = (order) => {
    try {
      if (order.itemImage) {
        return order.itemImage;
      }
      if (order.image) {
        return order.image;
      }
      return "/placeholder-image.jpg";
    } catch (error) {
      console.error("Error getting order image:", error);
      return "/placeholder-image.jpg";
    }
  };

  // Helper function to get order status
  const getOrderStatus = (order) => {
    if (!order.status) return { text: 'Pending', class: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> };
    
    switch (order.status.toLowerCase()) {
      case 'completed':
        return { text: 'Completed', class: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
      case 'pending':
        return { text: 'Pending', class: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> };
      case 'cancelled':
        return { text: 'Cancelled', class: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> };
      case 'processing':
        return { text: 'Processing', class: 'bg-blue-100 text-blue-800', icon: <Package className="w-4 h-4" /> };
      default:
        return { text: 'Pending', class: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> };
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-purple-900/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                My Orders
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your orders and view order history
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex gap-3"
            >
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-6 py-3 rounded-full"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="px-6 py-3 rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {orders.map((order, index) => {
              const status = getOrderStatus(order);
              return (
                <motion.div
                  key={order.orderId || order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Order Image */}
                    <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={getOrderImage(order)}
                        alt={order.productName || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {order.productName || 'Product Name Not Available'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {order.size && (
                              <span className="bg-muted px-2 py-1 rounded">
                                Size: {order.size}
                              </span>
                            )}
                            {order.color && (
                              <span className="bg-muted px-2 py-1 rounded">
                                Color: {order.color}
                              </span>
                            )}
                            {order.quantity && (
                              <span className="bg-muted px-2 py-1 rounded">
                                Qty: {order.quantity}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="text-2xl font-bold text-primary">
                            ₹{order.amount || 'N/A'}
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.class}`}>
                            {status.icon}
                            {status.text}
                          </div>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Order ID:</span>
                          <span className="ml-2 font-mono">{order.orderId || order.id}</span>
                        </div>
                        {order.paymentId && (
                          <div>
                            <span className="font-medium text-muted-foreground">Payment ID:</span>
                            <span className="ml-2 font-mono">{order.paymentId}</span>
                          </div>
                        )}
                        {order.createdAt && (
                          <div>
                            <span className="font-medium text-muted-foreground">Order Date:</span>
                            <span className="ml-2">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Shipping Address */}
                      {order.address && (
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Shipping Address</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>{order.address.firstName} {order.address.lastName}</p>
                            <p>{order.address.address}</p>
                            <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                            <p>{order.address.country}</p>
                            <p>Phone: {order.address.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}