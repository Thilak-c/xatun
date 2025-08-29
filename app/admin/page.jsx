'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  Upload,
  Image as ImageIcon,
  Settings,
  LogOut,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Calendar,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMainImageUrl, formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function AdminPage() {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [mounted, setMounted] = useState(false);

  // Redirect if not authenticated
  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/auth/signin');
  //   }
  // }, [status, router]);

  // Emergency escape hatch - force loading to false after 3 seconds
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      if (loading) {
        console.log('Emergency timeout triggered - forcing loading to false');
        setLoading(false);
        // Set minimal mock data
        if (orders.length === 0) {
          setOrders([{
            orderId: 'ORD-EMERGENCY',
            productName: 'Emergency Product',
            amount: 1000,
            status: 'pending',
            itemId: 'EMERGENCY-001',
            createdAt: new Date().toISOString()
          }]);
        }
        if (products.length === 0) {
          setProducts([{
            itemId: 'EMERGENCY-001',
            name: 'Emergency Product',
            price: 1000,
            category: 'Emergency',
            type: 'Emergency'
          }]);
        }
        setStats({
          totalOrders: 1,
          totalRevenue: 0,
          pendingOrders: 1,
          completedOrders: 0
        });
        toast.info('Emergency fallback activated. Please check your setup.');
      }
    }, 3000);

    return () => clearTimeout(emergencyTimeout);
  }, [loading, orders.length, products.length]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Initializing admin dashboard...</p>
        </div>
      </div>
    );
  }

  // // Show loading while checking authentication
  // if (status === 'loading') {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
  //         <p className="mt-4 text-muted-foreground">Checking authentication...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Show loading while fetching data (with timeout fallback)
  // if (loading && orders.length === 0 && products.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
  //         <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
  //         <p className="text-sm text-muted-foreground mt-2">This may take a few seconds</p>
  //         <div className="flex gap-3 mt-4 justify-center">
  //           <Button 
  //             onClick={() => window.location.reload()} 
  //             variant="outline"
  //           >
  //             Refresh Page
  //           </Button>
  //           <Button 
  //             onClick={() => {
  //               setLoading(false);
  //               // Force set mock data
  //               const mockOrders = [
  //                 {
  //                   orderId: 'ORD-123456789',
  //                   productName: 'Sample Product',
  //                   amount: 1500,
  //                   status: 'pending',
  //                   itemId: 'ITEM-001',
  //                   createdAt: new Date().toISOString()
  //                 }
  //               ];
                
  //               const mockProducts = [
  //                 {
  //                   itemId: 'ITEM-001',
  //                   name: 'Sample Product',
  //                   price: 1500,
  //                   category: 'Clothing',
  //                   type: 'T-Shirt'
  //                 }
  //               ];
                
  //               setOrders(mockOrders);
  //               setProducts(mockProducts);
  //               setStats({
  //                 totalOrders: mockOrders.length,
  //                 totalRevenue: 0,
  //                 pendingOrders: mockOrders.length,
  //                 completedOrders: 0
  //               });
  //               toast.info('Showing sample data. Please check your MongoDB connection.');
  //             }} 
  //             variant="default"
  //           >
  //             Show Sample Data
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Don't render if not authenticated (redirecting)
  // if (!session) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
  //         <p className="mt-4 text-muted-foreground">Redirecting to sign in...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          setLoading(false);
          toast.error('Request timeout. Please refresh the page.');
        }, 5000); // Reduced to 5 seconds
        
        // Fetch orders
        const ordersResponse = await fetch('/api/orders');
        if (!ordersResponse.ok) {
          throw new Error(`Orders API error: ${ordersResponse.status}`);
        }
        const ordersData = await ordersResponse.json();
        setOrders(ordersData || []);

        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error(`Products API error: ${productsResponse.status}`);
        }
        const productsData = await productsResponse.json();
        setProducts(productsData || []);

        // Calculate stats
        const totalRevenue = (ordersData || [])
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + (order.amount || 0), 0);

        setStats({
          totalOrders: (ordersData || []).length,
          totalRevenue,
          pendingOrders: (ordersData || []).filter(order => order.status === 'pending').length,
          completedOrders: (ordersData || []).filter(order => order.status === 'completed').length
        });

        clearTimeout(timeoutId);
        toast.success('Dashboard data loaded successfully!');

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(`Failed to load dashboard data: ${error.message}`);
        
        // Show mock data as fallback when APIs fail
        const mockOrders = [
          {
            orderId: 'ORD-123456789',
            productName: 'Sample Product',
            amount: 1500,
            status: 'pending',
            itemId: 'ITEM-001',
            createdAt: new Date().toISOString()
          }
        ];
        
        const mockProducts = [
          {
            itemId: 'ITEM-001',
            name: 'Sample Product',
            price: 1500,
            category: 'Clothing',
            type: 'T-Shirt'
          }
        ];
        
        setOrders(mockOrders);
        setProducts(mockProducts);
        setStats({
          totalOrders: mockOrders.length,
          totalRevenue: mockOrders.filter(order => order.status === 'completed').reduce((sum, order) => sum + (order.amount || 0), 0),
          pendingOrders: mockOrders.filter(order => order.status === 'pending').length,
          completedOrders: mockOrders.filter(order => order.status === 'completed').length
        });
        
        toast.info('Showing sample data. Please check your MongoDB connection.');
      } finally {
        setLoading(false);
      }
    };

    // Always fetch data immediately, don't wait for authentication status
    console.log('Fetching data immediately...');
    fetchData();
  }, []); // Remove dependency on status

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
        // Update the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status } : order
          )
        );

        // Update stats
        setStats(prev => ({
          ...prev,
          pendingOrders: orders.filter(order => order.status === 'pending').length,
          completedOrders: orders.filter(order => order.status === 'completed').length
        }));

        toast.success(`Order ${orderId} status updated to ${status}`);
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Filter orders based on status and search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const matchesSearch = searchQuery === '' || 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

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
                Admin Dashboard
              </h1>
              <p className="text-xl text-muted-foreground">
                Welcome back, Admin
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
                onClick={() => {
                  setLoading(true);
                  window.location.reload();
                }}
                className="px-6 py-3 rounded-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="destructive"
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="px-6 py-3 rounded-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
              Sign Out
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Debug Info - Remove in production */}
    
      {/* Navigation Tabs */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
              { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
              { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="px-6 py-3 rounded-full"
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingCart className="w-6 h-6" />, color: 'text-blue-600' },
                  { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-6 h-6" />, color: 'text-green-600' },
                  { label: 'Pending Orders', value: stats.pendingOrders, icon: <Clock className="w-6 h-6" />, color: 'text-yellow-600' },
                  { label: 'Completed Orders', value: stats.completedOrders, icon: <CheckCircle className="w-6 h-6" />, color: 'text-purple-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} bg-muted p-3 rounded-lg`}>
                        {stat.icon}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Upload Products', description: 'Add new products to your catalog', icon: <Upload className="w-8 h-8" />, href: '/admin/upload', color: 'from-green-500 to-emerald-600' },
                  { title: 'Manage Images', description: 'Organize and optimize product images', icon: <ImageIcon className="w-8 h-8" />, href: '/admin/image', color: 'from-blue-500 to-cyan-600' },
                  { title: 'View Orders', description: 'Process and manage customer orders', icon: <ShoppingCart className="w-8 h-8" />, href: '/admin/orders', color: 'from-purple-500 to-pink-600' }
                ].map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => router.push(action.href)}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{action.title}</h3>
                    <p className="text-muted-foreground mb-4">{action.description}</p>
                    <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-sm font-medium">Get Started</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* MongoDB Connection Status */}
              {orders.length > 0 && orders[0].orderId === 'ORD-123456789' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-amber-800 mb-2">
                        MongoDB Connection Issue
                      </h3>
                      <p className="text-amber-700 mb-4">
                        Your admin dashboard is currently showing sample data because it cannot connect to MongoDB. 
                        This means you won't see real orders or products until the connection is restored.
                      </p>
                      <div className="space-y-2 text-sm text-amber-600">
                        <p><strong>To fix this:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Make sure MongoDB is running on localhost:27017</li>
                          <li>Check if the 'xatun' database exists</li>
                          <li>Verify your MongoDB connection string</li>
                          <li>Restart your development server</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Filters and Search */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  {/* Status Filter */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64"
                    />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Showing {filteredOrders.length} of {orders.length} orders
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredOrders.map((order, index) => (
                        <motion.tr
                          key={order.orderId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.05 }}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={order.itemImage}
                                alt={order.productName}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <div className="font-medium text-foreground">{order.productName}</div>
                                <div className="text-sm text-muted-foreground">ID: {order.itemId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link 
                              href={`/admin/orders/${order.orderId}`}
                              className="text-primary hover:underline font-mono"
                            >
                              {order.orderId}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-foreground">
                              ₹{order.amount?.toLocaleString() || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-primary ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/orders/${order.orderId}`)}
                                className="px-3 py-1"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/orders/${order.orderId}`)}
                                className="px-3 py-1"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* No Orders Found */}
                {!loading && filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || orderStatusFilter !== 'all' 
                        ? 'Try adjusting your filters or search terms'
                        : 'No orders have been placed yet'
                      }
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Product Management</h2>
                <Button onClick={() => router.push('/admin/upload')} className="px-6 py-3 rounded-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Product
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 6).map((product, index) => (
                  <motion.div
                    key={product.itemId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <img
                      src={getMainImageUrl(product)}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-foreground mb-2">{product.name}</h3>
                      <p className="text-primary font-bold mb-2">{formatPrice(product.price)}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="bg-muted px-2 py-1 rounded">{product.category}</span>
                        <span className="bg-muted px-2 py-1 rounded">{product.type}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-12"
            >
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Customer Management</h3>
              <p className="text-muted-foreground">
                Customer management features coming soon...
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Toast Container */}
      <div id="toast-container" />
    </div>
  );
}