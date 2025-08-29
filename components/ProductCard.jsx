"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPrice, isOnSale, getCurrentPrice, calculateDiscount } from "@/lib/utils";

const ProductCard = ({ 
  product, 
  className = "",
  showActions = true,
  showRating = true,
  showQuickView = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    _id,
    itemId,
    name,
    price,
    salePrice,
    category,
    type,
    rating = 4.5,
    reviewCount = 12,
    mainImage,
    additionalImages = [],
    image, // For backward compatibility
    sizes = [],
    stock = 0
  } = product;

  const productId = itemId || _id;
  const currentPrice = getCurrentPrice(product);
  const discount = calculateDiscount(price, salePrice);
  
  // Calculate total stock from sizes array
  const totalStock = sizes.length > 0 
    ? sizes.reduce((sum, size) => sum + (size.stock || 0), 0)
    : stock || 0;
  
  const hasStock = totalStock > 0;
  const imageUrl = mainImage || image || (additionalImages[0] ? additionalImages[0] : '/placeholder-image.jpg');

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
  };


  const renderRating = () => {
    if (!showRating) return null;
    
    const stars = Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-3 h-3",
          i < Math.floor(rating) 
            ? "fill-yellow-400 text-yellow-400" 
            : "fill-gray-300 text-gray-300"
        )}
      />
    ));

    return (
      <div className="flex items-center space-x-1 mb-2">
        <div className="flex">{stars}</div>
        <span className="text-xs text-muted-foreground">
          ({reviewCount})
        </span>
      </div>
    );
  };

  const renderPrice = () => {
    return (
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-lg font-bold text-foreground">
          {formatPrice(currentPrice)}
        </span>
        {isOnSale(product) && (
          <>
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(price)}
            </span>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
              -{discount}%
            </span>
          </>
        )}
      </div>
    );
  };

  const renderStockStatus = () => {
    if (!hasStock) {
      return (
        <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">
          Out of Stock
        </span>
      );
    }
    
    if (totalStock <= 5) {
      return (
        <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-full">
          Only {totalStock} left
        </span>
      );
    }
    
    return null;
  };

  return (
    <motion.div
      className={cn(
        "group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Product Link Wrapper */}
      <Link href={`/products/${productId}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-muted overflow-hidden">
          {/* Main Image */}
          <Image
            src={imageUrl}
            alt={name}
            fill
            className={cn(
              "object-cover object-center transition-transform duration-500",
              isHovered ? "scale-110" : "scale-100"
            )}
            onLoad={() => setIsImageLoading(false)}
            priority={false}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Loading Skeleton */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}

          {/* Discount Badge */}
          {isOnSale(product) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            >
              -{discount}%
            </motion.div>
          )}

          {/* Stock Status */}
          {renderStockStatus() && (
            <div className="absolute top-3 right-3">
              {renderStockStatus()}
        </div>
          )}

          {/* Quick Actions Overlay */}
          {showActions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-black/20 flex items-center justify-center space-x-2"
            >
              {showQuickView && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleQuickView}
                  className="bg-white/90 text-foreground hover:bg-white"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              
             
              
            </motion.div>
          )}

          {/* Wishlist Button */}
          {showActions && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: 1 }}
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200"
              disabled={!hasStock}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors duration-200",
                  isWishlisted 
                    ? "fill-red-500 text-red-500" 
                    : "text-gray-600"
                )}
              />
            </motion.button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category & Type */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {category}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {type}
            </span>
          </div>

          {/* Rating */}
          {/* {renderRating()}/////////// */}
<div className="flex items-center">

          {/* Product Name */}
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {name}
          </h3>
  <div className=" px-2"> -</div>
          {/* Price */}
          {renderPrice()}
</div>

          {/* Sizes Preview */}
          {sizes.length > 0 && (
            <div className="flex items-center space-x-1 mb-2">
              <span className="text-xs text-muted-foreground">Sizes:</span>
              {sizes.slice(0, 3).map((size, index) => (
                <span
                  key={index}
                  className="text-xs bg-muted px-2 py-1 rounded text-foreground"
        >
                  {size.size}
                </span>
              ))}
              {sizes.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{sizes.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
     
    </motion.div>
  );
};

export default ProductCard;