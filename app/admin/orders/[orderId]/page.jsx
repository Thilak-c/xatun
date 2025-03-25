'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // Fetch order details and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order details
        const orderResponse = await fetch(`/api/orders/${orderId}`);
        if (!orderResponse.ok) throw new Error('Failed to fetch order details');
        const orderData = await orderResponse.json();
        setOrder(orderData);

        // Fetch messages
        const messagesResponse = await fetch(`/api/orders/${orderId}/messages`);
        if (!messagesResponse.ok) throw new Error('Failed to fetch messages');
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  // Send message to the order
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await fetch(`/api/orders/${orderId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      // Update messages state with the new message
      const newMessage = await response.json();
      setMessages([...messages, newMessage]);
      setMessage(''); // Clear input
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
    }
  };

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

  // Order not found
  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">
        Order not found.
      </div>
    );
  }

  // Format date using native JavaScript
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen md:pt-[50px] pt-[100px] bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>
            <p className="text-gray-400 mt-2">
              Placed on {formatDate(order.timestamp)}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${order.status === 'completed'
                ? 'bg-green-800 text-green-100'
                : order.status === 'pending'
                  ? 'bg-yellow-800 text-yellow-100'
                  : order.status === 'cancelled'
                    ? 'bg-red-800 text-red-100'
                    : 'bg-blue-800 text-blue-100'
              }`}
          >
            {order.status}
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Card */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className="flex items-start gap-6">
                <img
                  src={`data:${order.contentType};base64,${order.itemImage}`}
                  alt={order.productName}
                  className="w-32 h-32 rounded-lg object-cover"
                />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{order.productName}
<br />
                    <samp className='font-bold text-gray-100'>
                       size- {order.size} 
                    </samp>

                  </h3>
                  <p className="text-gray-400">Item ID: {order.itemId}</p>
                  <p className="text-gray-400">payment ID: {order.paymentId}</p>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{order.amount}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <div className="space-y-2">
                <p>{order.address.name}</p>
                <p>{order.address.address}</p>
                <p>
                  {order.address.city}, {order.address.state} {order.address.zip}
                </p>
                <p>{order.address.phone}</p>
              </div>
            </div>
          </div>

          {/* Messages Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg h-[460px] flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Order Communications</h2>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((msg) => (
                <div key={msg.timestamp} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span>👤</span> {/* Replace with an icon */}
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="mt-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}