# Image Upload & Storage System

This document describes the new image upload and storage system that replaces the previous Base64-based storage approach.

## Overview

The new system provides:
- **File-based storage** instead of Base64 strings in the database
- **Proper file validation** with size and type restrictions
- **Efficient storage** using the local filesystem
- **Better performance** for image loading and management
- **Cleaner database structure** with file paths instead of large strings

## Architecture

### Storage Structure
```
public/
├── uploads/           # Main image storage directory
│   ├── item1_1234567890_abc123.jpg
│   ├── item1_1234567890_def456.png
│   └── item2_1234567891_ghi789.webp
└── placeholder-image.jpg  # Fallback image
```

### Database Schema Changes
```javascript
// Old Schema (Base64)
{
  image: "base64_encoded_string_here...",
  contentType: "image/jpeg",
  additionalImages: ["base64_string1", "base64_string2"]
}

// New Schema (File Paths)
{
  mainImage: "/uploads/item1_1234567890_abc123.jpg",
  additionalImages: [
    "/uploads/item1_1234567890_def456.png",
    "/uploads/item1_1234567890_ghi789.webp"
  ]
}
```

## API Endpoints

### 1. Upload Product (`POST /api/upload`)
- **Purpose**: Upload new products with images
- **Input**: FormData with product details and image files
- **Output**: Success message with file paths

**Features:**
- File type validation (JPEG, PNG, WebP)
- File size validation (max 5MB per image)
- Automatic filename generation
- Support for main image + additional images

**Example Request:**
```javascript
const formData = new FormData();
formData.append('itemId', 'ABC123');
formData.append('name', 'Product Name');
formData.append('price', '99.99');
formData.append('description', 'Product description');
formData.append('category', 'men');
formData.append('type', 'tshirts');
formData.append('sizes', JSON.stringify([{size: 'M', stock: 10}]));
formData.append('mainImage', mainImageFile);
formData.append('additionalImages', additionalImageFile1);
formData.append('additionalImages', additionalImageFile2);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

### 2. Get Images (`GET /api/images`)
- **Purpose**: Retrieve all products with images
- **Query Parameters**:
  - `name`: Search by product name
  - `category`: Filter by category
  - `type`: Filter by type
- **Output**: Array of products with image paths

### 3. Get Single Product (`GET /api/images/[id]`)
- **Purpose**: Retrieve a specific product by ID
- **Output**: Single product with image paths

### 4. Delete Images/Products (`DELETE /api/images/delete`)
- **Purpose**: Delete products or specific images
- **Query Parameters**:
  - `productId`: Required - ID of the product
  - `imagePath`: Optional - specific image to delete
- **Behavior**:
  - With `imagePath`: Deletes specific image from product
  - Without `imagePath`: Deletes entire product and all images

## Frontend Components

### 1. Upload Form (`/admin/upload`)
- **Features**:
  - Drag & drop file uploads
  - Real-time file validation
  - Image previews
  - File size display
  - Category and type selection
  - Size and stock management

### 2. Product Gallery (`/image`)
- **Features**:
  - Grid display of all products
  - Search functionality
  - Edit and delete actions
  - Image hover effects
  - Responsive design

## Utility Functions (`/lib/imageUtils.js`)

### File Validation
```javascript
import { validateImageFile, validateMultipleImages } from '@/lib/imageUtils';

// Validate single file
const validation = validateImageFile(file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
});

// Validate multiple files
const validation = validateMultipleImages(files, options);
```

### File Management
```javascript
import { 
  generateImageFilename, 
  formatFileSize, 
  getImageDimensions 
} from '@/lib/imageUtils';

// Generate unique filename
const filename = generateImageFilename('image.jpg', 'ITEM123');

// Format file size
const size = formatFileSize(1024000); // "1000 KB"

// Get image dimensions
const dimensions = await getImageDimensions(file);
```

## File Validation Rules

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### Size Limits
- **Main Image**: 5MB maximum
- **Additional Images**: 5MB maximum each
- **Total Upload**: No strict limit, but consider server resources

### Naming Convention
```
{itemId}_{timestamp}_{randomString}.{extension}

Example: ABC123_1703123456789_x7y2z9.jpg
```

## Error Handling

### Common Error Scenarios
1. **File Type Not Supported**: Clear error message with supported formats
2. **File Too Large**: Size limit exceeded with specific limit
3. **Missing Required Fields**: Validation errors for form fields
4. **Upload Failures**: Network and server error handling
5. **File System Errors**: Disk space and permission issues

### User Feedback
- **Success Messages**: Green background with confirmation
- **Error Messages**: Red background with specific details
- **Loading States**: Spinners and disabled buttons during operations
- **File Information**: Size, type, and preview for uploaded files

## Migration from Base64

### Backward Compatibility
The system maintains backward compatibility with existing Base64 images:
- **Display**: Automatically detects and handles both formats
- **Database**: Gradually migrates as products are updated
- **API**: Returns both old and new image formats

### Migration Strategy
1. **Phase 1**: Deploy new system alongside old
2. **Phase 2**: Update existing products to use new format
3. **Phase 3**: Remove Base64 support (optional)

## Security Considerations

### File Upload Security
- **Type Validation**: Strict MIME type checking
- **Size Limits**: Prevents large file attacks
- **Filename Sanitization**: Prevents path traversal
- **Directory Isolation**: Uploads stored in dedicated directory

### Access Control
- **Admin Only**: Upload functionality restricted to admin users
- **Authentication**: Proper user verification required
- **File Permissions**: Secure file system permissions

## Performance Optimizations

### Storage Efficiency
- **No Base64 Overhead**: Eliminates 33% size increase
- **Direct File Access**: Faster image loading
- **CDN Ready**: Easy integration with CDN services

### Database Performance
- **Smaller Documents**: Reduced database size
- **Faster Queries**: Smaller data transfer
- **Better Indexing**: Improved search performance

## Monitoring and Maintenance

### File Cleanup
- **Automatic Cleanup**: Files deleted when products are removed
- **Orphan Detection**: Identify unused files
- **Storage Monitoring**: Track disk usage

### Health Checks
- **File Integrity**: Verify uploaded files
- **Storage Space**: Monitor available disk space
- **Performance Metrics**: Track upload/download times

## Troubleshooting

### Common Issues
1. **Upload Directory Missing**: Ensure `/public/uploads` exists
2. **File Permissions**: Check write permissions on upload directory
3. **Disk Space**: Monitor available storage space
4. **File Type Issues**: Verify MIME type detection

### Debug Information
- **Console Logs**: Detailed upload process logging
- **Error Responses**: Specific error messages from API
- **File Validation**: Client-side validation feedback

## Future Enhancements

### Planned Features
- **Image Compression**: Automatic optimization
- **Thumbnail Generation**: Multiple size variants
- **Cloud Storage**: AWS S3 or similar integration
- **Image Editing**: Basic crop and resize
- **Bulk Operations**: Multiple file management

### Scalability
- **CDN Integration**: Global image delivery
- **Image Processing**: Server-side optimization
- **Caching**: Browser and CDN caching
- **Load Balancing**: Multiple server support

## Support

For technical support or questions about the image system:
1. Check this documentation
2. Review console logs for errors
3. Verify file permissions and storage space
4. Contact the development team

---

**Last Updated**: December 2024
**Version**: 2.0.0
**Compatibility**: Next.js 15+, Node.js 18+ 