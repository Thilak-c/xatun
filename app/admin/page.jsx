'use client'; // Mark as a Client Component

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // Default tab
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  // Redirect to sign-in page if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  // Function to update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the local state to reflect the change
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status } : order
          )
        );
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Filter orders based on active tab and search query
  const filteredOrders = orders
    .filter((order) => order.status === activeTab)
    .filter((order) =>
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900">Loading...</div>;
  }

  if (!session) {
    return null; // Redirecting to sign-in page
  }

  return (
    <div className="min-h-screen pt-[100px] md:pt-[50px] bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Link
              href="/admin/upload"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Upload
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs for Order Status */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-md ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
              }`}
          >
            Pending Orders
          </button>
          <button
            onClick={() => setActiveTab('processing')}
            className={`px-4 py-2 rounded-md ${activeTab === 'processing' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
              }`}
          >
            Processing Orders
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-md ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
              }`}
          >
            Completed Orders
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 rounded-md ${activeTab === 'cancelled' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
              }`}
          >
            Cancelled Orders
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Order ID or Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mobile-friendly layout */}
        <div className="md:hidden space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center space-x-4">
                <img
                  src={`data:${order.contentType};base64,${order.itemImage}`}
                  alt={order.productName}
                  className="h-12 w-12 rounded-md"
                />
                <div>
                  <div className="text-sm font-medium text-white">{order.productName}</div>
                  <div className="text-xs text-gray-400">Order ID: {order.orderId}</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-300">


                  <span className="font-semibold">Item ID:</span>    <a href={`/admin/orders/${order.orderId}`} className="text-blue-400 hover:underline">
                    {order.orderId}
                  </a>
                </div>
                <div className="text-sm text-gray-300">
                  <span className="font-semibold">Status:</span>{' '}
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'completed'
                      ? 'bg-green-800 text-green-100'
                      : order.status === 'pending'
                        ? 'bg-yellow-800 text-yellow-100'
                        : order.status === 'cancelled'
                          ? 'bg-red-800 text-red-100'
                          : 'bg-blue-800 text-blue-100'
                      }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
                  Item Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Item ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={`data:${order.contentType};base64,${order.itemImage}`}
                      alt={order.productName}
                      className="h-12 w-12 rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.itemId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <Link href={`/admin/orders/${order.orderId}`} className="text-blue-400 hover:underline">
                      {order.orderId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'completed'
                        ? 'bg-green-800 text-green-100'
                        : order.status === 'pending'
                          ? 'bg-yellow-800 text-yellow-100'
                          : order.status === 'cancelled'
                            ? 'bg-red-800 text-red-100'
                            : 'bg-blue-800 text-blue-100'
                        }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
          </div>
        )}

        {/* No Orders Found */}
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center text-gray-400 mt-6">No {activeTab} orders found.</div>
        )}
      </div>
    </div>
  );
}