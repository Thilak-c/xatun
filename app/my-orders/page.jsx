'use client'; // Mark as a Client Component

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details and messages for each order ID in localStorage
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
        const orderDetails = await Promise.all(
          userOrders.map(async (order) => {
            // Fetch order details
            const orderResponse = await fetch(`/api/orders/${order.orderId}`);
            if (!orderResponse.ok) throw new Error('Failed to fetch order details');
            const orderData = await orderResponse.json();

            // Fetch messages for the order
            const messagesResponse = await fetch(`/api/orders/${order.orderId}/messages`);
            if (!messagesResponse.ok) throw new Error('Failed to fetch messages');
            const messagesData = await messagesResponse.json();

            // Combine order details and messages
            return { ...orderData, messages: messagesData };
          })
        );
        setOrders(orderDetails);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
      console.log(orders)
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
  console.log(orders)
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
        No orders found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 md:pt-[50px] pt-[100px] text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {/* Mobile-friendly layout */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-12 w-12">
                  <img
                    src={`data:${order.contentType};base64,${order.itemImage}`}
                    alt={order.productName}
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{order.productName}
                    <samp className='text-xs mx-2 text-gray-400'>
                      ({order.size})
                    </samp>
                  </div>
                  <div className="text-xs text-gray-400">Order ID: {order.orderId}</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-300">
                  <span className="font-semibold">Amount:</span> ₹{order.amount}
                </div>
                <div className="text-sm text-gray-300">
                  <span className="font-semibold">Status:</span>{' '}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'completed'
                      ? 'bg-green-800 text-green-100'
                      : order.status === 'pending'
                        ? 'bg-yellow-800 text-yellow-100'
                        : order.status === 'cancelled'
                          ? 'bg-red-800 text-red-100'
                          : 'bg-blue-800 text-blue-100'
                      }`}
                  >
                    {order.status || 'Pending'}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  <span className="font-semibold">Address:</span>{' '}
                  <div>
                    <p>{order.address.name}</p>
                    <p>{order.address.address}</p>
                    <p>
                      {order.address.city}, {order.address.state}, {order.address.zip}
                    </p>
                    <p>Phone: {order.address.phone}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  <span className="font-semibold">Messages:</span>
                  <div className="space-y-2 mt-2">
                    {order.messages.map((msg) => (
                      <div key={msg.timestamp} className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    ))}
                    {order.messages.length === 0 && <p>No messages</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          src={`data:${order.contentType};base64,${order.itemImage}`}
                          alt={order.productName}
                          width={48}
                          height={48}
                          className="rounded-md"
                        />
                      </div>
                      <div className=" flex ml-4">
                        <div className="text-sm items-center font-medium text-white">{order.productName}
                          <samp className='text-xs mx-2 text-gray-400'>
                            ({order.size})
                          </samp></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                    ₹{order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div>
                      <p>Name: {order.address.name}</p>
                      <p>{order.address.address}</p>
                      <p>
                        {order.address.city}, {order.address.state}, {order.address.zip}
                      </p>
                      <p>Phone: {order.address.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="space-y-2">
                      {order.messages.map((msg) => (
                        <div key={msg.timestamp} className="bg-gray-700 rounded-lg p-3">
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(msg.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      ))}
                      {order.messages.length === 0 && <p>No messages</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'completed'
                        ? 'bg-green-800 text-green-100'
                        : order.status === 'pending'
                          ? 'bg-yellow-800 text-yellow-100'
                          : order.status === 'cancelled'
                            ? 'bg-red-800 text-red-100'
                            : 'bg-blue-800 text-blue-100'
                        }`}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}