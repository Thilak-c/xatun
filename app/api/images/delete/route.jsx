import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import clientPromise from '@/lib/mongodb';

// Delete file from storage
async function deleteFile(filePath) {
  if (!filePath || filePath.startsWith('data:')) {
    return; // Skip Base64 images or invalid paths
  }

  try {
    const fullPath = join(process.cwd(), 'public', filePath);
    if (existsSync(fullPath)) {
      await unlink(fullPath);
      console.log(`Deleted file: ${fullPath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const imagePath = searchParams.get('imagePath');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('xatun');
    const collection = db.collection("products");

    if (imagePath) {
      // Delete specific image
      const product = await collection.findOne({ _id: new ObjectId(productId) });
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      // Remove image from product
      let updateResult;
      if (product.mainImage === imagePath) {
        updateResult = await collection.updateOne(
          { _id: new ObjectId(productId) },
          { $unset: { mainImage: "" } }
        );
      } else {
        updateResult = await collection.updateOne(
          { _id: new ObjectId(productId) },
          { $pull: { additionalImages: imagePath } }
        );
      }

      if (updateResult.modifiedCount > 0) {
        await deleteFile(imagePath);
        return NextResponse.json({
          success: true,
          message: 'Image deleted successfully'
        });
      } else {
        return NextResponse.json(
          { error: 'Image not found in product' },
          { status: 404 }
        );
      }
    } else {
      // Delete entire product and all its images
      const product = await collection.findOne({ _id: new ObjectId(productId) });
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      // Delete all images
      if (product.mainImage) {
        await deleteFile(product.mainImage);
      }
      
      if (product.additionalImages && product.additionalImages.length > 0) {
        for (const imagePath of product.additionalImages) {
          await deleteFile(imagePath);
        }
      }

      // Delete product from database
      const deleteResult = await collection.deleteOne({ _id: new ObjectId(productId) });
      
      if (deleteResult.deletedCount > 0) {
        return NextResponse.json({
          success: true,
          message: 'Product and all images deleted successfully'
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to delete product' },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    console.error('Error deleting image/product:', error);
    return NextResponse.json(
      { error: 'Failed to delete image/product' },
      { status: 500 }
    );
  }
} 