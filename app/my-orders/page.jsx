'use client'; // Mark as a Client Component

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getMainImageUrl } from "@/lib/imageUtils";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details and messages for each order ID in localStorage
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
        console.log("User orders from localStorage:", userOrders);
        
        if (userOrders.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const orderDetails = await Promise.all(
          userOrders.map(async (order) => {
            try {
              // Fetch order details
              const orderResponse = await fetch(`/api/orders/${order.orderId}`);
              if (!orderResponse.ok) {
                console.error(`Failed to fetch order ${order.orderId}:`, orderResponse.status);
                return null;
              }
              const orderData = await orderResponse.json();

              // Fetch messages for the order
              const messagesResponse = await fetch(`/api/orders/${order.orderId}/messages`);
              let messagesData = [];
              if (messagesResponse.ok) {
                messagesData = await messagesResponse.json();
              } else {
                console.warn(`Failed to fetch messages for order ${order.orderId}`);
              }

              // Combine order details and messages
              return { ...orderData, messages: messagesData };
            } catch (error) {
              console.error(`Error processing order ${order.orderId}:`, error);
              return null;
            }
          })
        );

        // Filter out failed orders
        const validOrders = orderDetails.filter(order => order !== null);
        console.log("Valid orders loaded:", validOrders);
        setOrders(validOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

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
        return getMainImageUrl(order);
      }
      return "/placeholder-image.jpg"; // Fallback image
    } catch (error) {
      console.error("Error getting order image:", error);
      return "/placeholder-image.jpg";
    }
  };

  // Helper function to get order status
  const getOrderStatus = (order) => {
    if (!order.status) return { text: 'Pending', class: 'bg-yellow-800 text-yellow-100' };
    
    switch (order.status.toLowerCase()) {
      case 'completed':
        return { text: 'Completed', class: 'bg-green-800 text-green-100' };
      case 'pending':
        return { text: 'Pending', class: 'bg-yellow-800 text-yellow-100' };
      case 'cancelled':
        return { text: 'Cancelled', class: 'bg-red-800 text-red-100' };
      case 'processing':
        return { text: 'Processing', class: 'bg-blue-800 text-blue-100' };
      default:
        return { text: 'Pending', class: 'bg-yellow-800 text-yellow-100' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 md:pt-[50px] pt-[100px] text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {/* Mobile-friendly layout */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => {
            const status = getOrderStatus(order);
            return (
              <div key={order.orderId} className="bg-gray-800 rounded-lg p-4 shadow-md">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img
                      src={getOrderImage(order)}
                      alt={order.productName || 'Product'}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {order.productName || 'Product Name Not Available'}
                      {order.size && (
                        <span className='text-xs mx-2 text-gray-400'>
                          ({order.size})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">Order ID: {order.orderId}</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-300">
                    <span className="font-semibold">Amount:</span> ₹{order.amount || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-300">
                    <span className="font-semibold">Status:</span>{' '}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.class}`}>
                      {status.text}
                    </span>
                  </div>
                  {order.address && (
                    <div className="text-sm text-gray-300">
                      <span className="font-semibold">Address:</span>{' '}
                      <div>
                        <p>{order.address.name || 'N/A'}</p>
                        <p>{order.address.address || 'N/A'}</p>
                        <p>
                          {order.address.city || 'N/A'}, {order.address.state || 'N/A'}, {order.address.zip || 'N/A'}
                        </p>
                        <p>Phone: {order.address.phone || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-gray-300">
                    <span className="font-semibold">Messages:</span>
                    <div className="space-y-2 mt-2">
                      {order.messages && order.messages.length > 0 ? (
                        order.messages.map((msg) => (
                          <div key={msg.timestamp || Math.random()} className="bg-gray-700 rounded-lg p-3">
                            <p className="text-sm">{msg.content || 'Message content not available'}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {msg.timestamp ? new Date(msg.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }) : 'Timestamp not available'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No messages</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => {
                const status = getOrderStatus(order);
                return (
                  <tr key={order.orderId} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            src={getOrderImage(order)}
                            alt={order.productName || 'Product'}
                            width={48}
                            height={48}
                            className="rounded-md object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                        </div>
                        <div className="flex ml-4">
                          <div className="text-sm items-center font-medium text-white">
                            {order.productName || 'Product Name Not Available'}
                            {order.size && (
                              <span className='text-xs mx-2 text-gray-400'>
                                ({order.size})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                      ₹{order.amount || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.address ? (
                        <div>
                          <p>Name: {order.address.name || 'N/A'}</p>
                          <p>{order.address.address || 'N/A'}</p>
                          <p>
                            {order.address.city || 'N/A'}, {order.address.state || 'N/A'}, {order.address.zip || 'N/A'}
                          </p>
                          <p>Phone: {order.address.phone || 'N/A'}</p>
                        </div>
                      ) : (
                        <p>Address not available</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="space-y-2">
                        {order.messages && order.messages.length > 0 ? (
                          order.messages.map((msg) => (
                            <div key={msg.timestamp || Math.random()} className="bg-gray-700 rounded-lg p-3">
                              <p className="text-sm">{msg.content || 'Message content not available'}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {msg.timestamp ? new Date(msg.timestamp).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }) : 'Timestamp not available'}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p>No messages</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.class}`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}