// Image utility functions for the application

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with success and error message
 */
export function validateImageFile(file, options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  } = options;

  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      success: false, 
      error: `File type not supported. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { 
      success: false, 
      error: `File size too large. Maximum size: ${maxSizeMB}MB` 
    };
  }

  return { success: true };
}

/**
 * Generate unique filename for uploaded image
 * @param {string} originalName - Original filename
 * @param {string} itemId - Product item ID
 * @returns {string} - Unique filename
 */
export function generateImageFilename(originalName, itemId) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop().toLowerCase();
  return `${itemId}_${timestamp}_${randomString}.${extension}`;
}

/**
 * Get image dimensions from file
 * @param {File} file - Image file
 * @returns {Promise<Object>} - Promise resolving to width and height
 */
export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if image is landscape or portrait
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} - 'landscape', 'portrait', or 'square'
 */
export function getImageOrientation(width, height) {
  if (width > height) return 'landscape';
  if (width < height) return 'portrait';
  return 'square';
}

/**
 * Create thumbnail URL from main image path
 * @param {string} imagePath - Main image path
 * @param {string} suffix - Thumbnail suffix
 * @returns {string} - Thumbnail path
 */
export function getThumbnailPath(imagePath, suffix = '_thumb') {
  if (!imagePath) return '';
  
  const lastDotIndex = imagePath.lastIndexOf('.');
  if (lastDotIndex === -1) return imagePath;
  
  const basePath = imagePath.substring(0, lastDotIndex);
  const extension = imagePath.substring(lastDotIndex);
  
  return `${basePath}${suffix}${extension}`;
}

/**
 * Validate multiple image files
 * @param {File[]} files - Array of files to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with valid files and errors
 */
export function validateMultipleImages(files, options = {}) {
  const validFiles = [];
  const errors = [];

  files.forEach((file, index) => {
    const validation = validateImageFile(file, options);
    if (validation.success) {
      validFiles.push(file);
    } else {
      errors.push(`File ${index + 1} (${file.name}): ${validation.error}`);
    }
  });

  return {
    validFiles,
    errors,
    hasErrors: errors.length > 0
  };
}

/**
 * Get image URL that handles both new file path system and legacy Base64 system
 * @param {Object} product - Product object
 * @param {string} imageField - Field name for the image (default: 'image')
 * @param {string} contentTypeField - Field name for content type (default: 'contentType')
 * @returns {string} - Image URL or data URL
 */
export function getImageUrl(product, imageField = 'image', contentTypeField = 'contentType') {
  // Handle new file path structure
  if (product.mainImage) {
    return product.mainImage;
  }
  
  // Handle legacy Base64 structure
  if (product[imageField] && product[contentTypeField]) {
    return `data:${product[contentTypeField]};base64,${product[imageField]}`;
  }
  
  // Fallback to a placeholder image
  return '/placeholder-image.jpg';
}

/**
 * Get main image URL for a product
 * @param {Object} product - Product object
 * @returns {string} - Main image URL
 */
export function getMainImageUrl(product) {
  return getImageUrl(product, 'image', 'contentType');
}

/**
 * Get additional images URLs for a product
 * @param {Object} product - Product object
 * @returns {string[]} - Array of additional image URLs
 */
export function getAdditionalImageUrls(product) {
  if (product.additionalImages && Array.isArray(product.additionalImages)) {
    return product.additionalImages;
  }
  
  // Handle legacy additional images if they exist
  if (product.additionalImages && Array.isArray(product.additionalImages)) {
    return product.additionalImages.map(img => {
      if (typeof img === 'string' && img.startsWith('data:')) {
        return img; // Already a data URL
      }
      return getImageUrl({ image: img, contentType: 'image/jpeg' });
    });
  }
  
  return [];
} 