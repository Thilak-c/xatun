'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Eye, 
  ArrowRight,
  Package,
  Loader2,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { cn, formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setWishlistItems(parsedWishlist);
        } catch (e) {
          console.error('Error parsing wishlist:', e);
          setWishlistItems([]);
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = (itemId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
    toast.success('Item removed from wishlist');
  };

  // Remove multiple items
  const removeSelected = () => {
    const updatedWishlist = wishlistItems.filter(item => !selectedItems.includes(item.id));
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setSelectedItems([]);
    toast.success(`${selectedItems.length} items removed from wishlist`);
  };

  // Add to cart
  const addToCart = (item) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex(cartItem => 
        cartItem.id === item.id && cartItem.size === item.size
      );

      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push({
          ...item,
          quantity: 1
        });
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      toast.success(`${item.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Add multiple items to cart
  const addSelectedToCart = () => {
    let addedCount = 0;
    selectedItems.forEach(itemId => {
      const item = wishlistItems.find(wishlistItem => wishlistItem.id === itemId);
      if (item) {
        addToCart(item);
        addedCount++;
      }
    });
    setSelectedItems([]);
    toast.success(`${addedCount} items added to cart`);
  };

  // Toggle item selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Select all items
  const selectAll = () => {
    setSelectedItems(wishlistItems.map(item => item.id));
  };

  // Deselect all items
  const deselectAll = () => {
    setSelectedItems([]);
  };

  // Calculate totals
  const totalValue = wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const selectedValue = selectedItems.reduce((sum, itemId) => {
    const item = wishlistItems.find(wishlistItem => wishlistItem.id === itemId);
    return sum + (item?.price || 0);
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-purple-900/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4">
              My Wishlist
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Keep track of your favorite products and add them to cart when you're ready to purchase.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {wishlistItems.length === 0 ? (
            // Empty Wishlist State
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart className="w-16 h-16 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Your Wishlist is Empty
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Start building your wishlist by browsing our collection and adding items you love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => router.push('/')}
                  className="px-8 py-4 text-lg rounded-full"
                >
                  Browse Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/products')}
                  className="px-8 py-4 text-lg rounded-full"
                >
                  View All Products
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Wishlist Stats and Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-2xl border border-border p-6 mb-8"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-muted-foreground">Total Items</p>
                      <p className="text-2xl font-bold text-foreground">{wishlistItems.length}</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-bold text-foreground">{formatPrice(totalValue)}</p>
                    </div>
                    {selectedItems.length > 0 && (
                      <div className="text-center sm:text-left">
                        <p className="text-sm text-muted-foreground">Selected Value</p>
                        <p className="text-2xl font-bold text-primary">{formatPrice(selectedValue)}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-muted rounded-lg p-1">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="rounded-md"
                      >
                        <Package className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="rounded-md"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Bulk Actions */}
                    {selectedItems.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addSelectedToCart}
                          className="flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart ({selectedItems.length})
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={removeSelected}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove ({selectedItems.length})
                        </Button>
                      </>
                    )}

                    {/* Select All */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAll}
                        disabled={selectedItems.length === wishlistItems.length}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deselectAll}
                        disabled={selectedItems.length === 0}
                      >
                        Deselect All
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Wishlist Items */}
              <div className={cn(
                "gap-6",
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-4"
              )}>
                <AnimatePresence>
                  {wishlistItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={cn(
                        "relative",
                        viewMode === 'list' && "col-span-full"
                      )}
                    >
                      {/* Selection Checkbox */}
                      <div className="absolute top-4 left-4 z-10">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="w-5 h-5 text-primary bg-background border-2 border-primary rounded focus:ring-primary focus:ring-2"
                        />
                      </div>

                      {/* Product Card */}
                      <div className="relative">
                        <ProductCard
                          product={item}
                          showActions={false}
                          showRating={true}
                          showQuickView={true}
                        />
                        
                        {/* Wishlist Actions Overlay */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => addToCart(item)}
                            className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromWishlist(item.id)}
                            className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Bottom Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 text-center"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => router.push('/cart')}
                    className="px-8 py-4 text-lg rounded-full"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Go to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="px-8 py-4 text-lg rounded-full"
                  >
                    Continue Shopping
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Toast Container */}
      <div id="toast-container" />
    </div>
  );
} 