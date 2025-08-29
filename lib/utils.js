import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function getImageUrl(imagePath) {
  if (!imagePath) return '/placeholder-image.jpg'
  if (imagePath.startsWith('http')) return imagePath
  if (imagePath.startsWith('/')) return imagePath
  return `/${imagePath}`
}

export function getMainImageUrl(product) {
  if (!product) return '/placeholder-image.jpg'
  
  // Handle new file-based system
  if (product.mainImage) {
    return getImageUrl(product.mainImage)
  }
  
  // Handle old Base64 system
  if (product.image) {
    return product.image
  }
  
  // Handle additional images
  if (product.additionalImages && product.additionalImages.length > 0) {
    return getImageUrl(product.additionalImages[0])
  }
  
  return '/placeholder-image.jpg'
}

export function getCategoryDisplayName(category) {
  const categoryMap = {
    'men': 'Men',
    'women': 'Women',
    'shoes': 'Shoes',
    'accessories': 'Accessories',
    'Carouselimg': 'Featured'
  }
  
  return categoryMap[category] || category
}

export function getTypeDisplayName(type) {
  const typeMap = {
    'tshirts': 'T-Shirts',
    'hoodies': 'Hoodies',
    'jeans': 'Jeans',
    'jackets': 'Jackets',
    'sneakers': 'Sneakers',
    'boots': 'Boots',
    'watches': 'Watches',
    'bags': 'Bags'
  }
  
  return typeMap[type] || type
}

export function calculateDiscount(originalPrice, salePrice) {
  if (!originalPrice || !salePrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export function isOnSale(product) {
  return product.salePrice && product.salePrice < product.price
}

export function getCurrentPrice(product) {
  return isOnSale(product) ? product.salePrice : product.price
}

export function sortProducts(products, sortBy = 'newest') {
  const sortedProducts = [...products]
  
  switch (sortBy) {
    case 'newest':
      return sortedProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    case 'oldest':
      return sortedProducts.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
    case 'price-low':
      return sortedProducts.sort((a, b) => getCurrentPrice(a) - getCurrentPrice(b))
    case 'price-high':
      return sortedProducts.sort((a, b) => getCurrentPrice(b) - getCurrentPrice(a))
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return sortedProducts
  }
}

export function filterProducts(products, filters = {}) {
  return products.filter(product => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.type && product.type !== filters.type) return false
    if (filters.minPrice && getCurrentPrice(product) < filters.minPrice) return false
    if (filters.maxPrice && getCurrentPrice(product) > filters.maxPrice) return false
    if (filters.onSale && !isOnSale(product)) return false
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })
}

export function getPaginationInfo(totalItems, currentPage, itemsPerPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  return {
    totalPages,
    startItem,
    endItem,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
  }
}

export function getRandomProducts(products, count = 4) {
  const shuffled = [...products].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export function getRelatedProducts(product, allProducts, count = 4) {
  return allProducts
    .filter(p => p._id !== product._id && (p.category === product.category || p.type === product.type))
    .slice(0, count)
}