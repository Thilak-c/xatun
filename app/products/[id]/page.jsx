"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Star, 
  X, 
  Heart,
  Share2,
  Truck,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Package,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMainImageUrl, getAdditionalImageUrls } from "@/lib/imageUtils";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeStock, setSizeStock] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        
        const productData = await response.json();
        setProduct(productData);
        
        // Set initial selected image
        const mainImage = getMainImageUrl(productData);
        setSelectedImage(mainImage);
        
        // Check if product is in wishlist
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsInWishlist(wishlist.some(item => item.itemId === productData.itemId));
        
        // Fetch related products
        const relatedResponse = await fetch(`/api/products?category=${productData.category}`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData.filter(p => p.itemId !== productData.itemId).slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Handle size selection
  const handleSizeSelection = (size) => {
    setSelectedSize(size);
    const selectedSizeObj = product.sizes.find((s) => s.size === size);
    if (selectedSizeObj) {
      setSizeStock(selectedSizeObj.stock);
    }
  };

  // Add to cart
  const addToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (sizeStock === 0) {
      toast.error("Selected size is out of stock");
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      
      // Check if item already exists in cart with same size
      const existingItemIndex = cart.findIndex(
        (item) => item.itemId === product.itemId && item.size === selectedSize
      );

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
        toast.success(`${product.name} quantity updated in cart!`);
      } else {
        cart.push({ 
          ...product, 
          size: selectedSize, 
          quantity: 1,
          image: getMainImageUrl(product)
        });
        toast.success(`${product.name} added to cart successfully!`);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      setError(""); // Clear any previous errors
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (isInWishlist) {
        const updatedWishlist = wishlist.filter(item => item.itemId !== product.itemId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        const updatedWishlist = [...wishlist, { ...product, image: getMainImageUrl(product) }];
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsInWishlist(true);
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  // Share product
  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this amazing product: ${product.name}`,
          url: window.location.href,
        });
        toast.success("Product shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Failed to share product");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-6">Product Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/products")} className="px-8 py-4 text-lg rounded-full">
              Browse Products
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/")}
              className="px-8 py-4 text-lg rounded-full"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return null;
  }

  // Get all images for the product
  const allImages = [getMainImageUrl(product), ...getAdditionalImageUrls(product)].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-purple-900/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {product.category} / {product.type}
              </h1>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left Column - Product Images */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                {/* Main Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setIsLightboxOpen(true)}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold">
                    Click to Zoom
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {allImages.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto">
                    {allImages.map((img, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                          selectedImage === img
                            ? "ring-2 ring-primary scale-105"
                            : "ring-1 ring-border hover:ring-primary/50"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Right Column - Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Product Title */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="bg-muted px-3 py-1 rounded-full text-sm">
                      {product.category}
                    </span>
                    <span className="bg-muted px-3 py-1 rounded-full text-sm">
                      {product.type}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>
                  {product.oldPrice && (
                    <div className="text-green-600 font-medium">
                      Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Size Selection */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Select Size</h3>
                  {!product.sizes || product.sizes.length === 0 ? (
                    <p className="text-red-500 text-sm">No sizes available for this product</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((sizeObj) => (
                        <Button
                          key={sizeObj.size}
                          variant={selectedSize === sizeObj.size ? "default" : "outline"}
                          onClick={() => handleSizeSelection(sizeObj.size)}
                          disabled={sizeObj.stock === 0}
                          className={`px-6 py-3 rounded-full ${
                            sizeObj.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {sizeObj.size}
                          {sizeObj.stock === 0 && " (Out of Stock)"}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                {selectedSize && (
                  <div className="flex items-center gap-2">
                    {sizeStock > 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={sizeStock > 0 ? "text-green-600" : "text-red-600"}>
                      {sizeStock > 0 ? `${sizeStock} in stock` : "Out of stock"}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={addToCart}
                    disabled={!selectedSize || sizeStock === 0}
                    className="flex-1 py-4 text-lg rounded-full"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={toggleWishlist}
                    className="px-6 py-4 rounded-full"
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current text-red-500" : ""}`} />
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={shareProduct}
                    className="px-6 py-4 rounded-full"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-800">{error}</span>
                  </motion.div>
                )}

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-3 text-center">
                    <Truck className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Free Shipping</div>
                      <div className="text-sm text-muted-foreground">Over ₹999</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-center">
                    <Shield className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Secure Payment</div>
                      <div className="text-sm text-muted-foreground">100% Protected</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-center">
                    <Package className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Easy Returns</div>
                      <div className="text-sm text-muted-foreground">30 Days</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Related Products
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover more amazing products in the same category
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.itemId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/products/${relatedProduct.itemId}`)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getMainImageUrl(relatedProduct)}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 text-white bg-white/20 rounded-full p-2 hover:bg-white/40 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              src={selectedImage}
              alt={product.name}
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <div id="toast-container" />
    </div>
  );
}