// app/api/images/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name'); // Get the search query
    const category = searchParams.get('category'); // Get category filter
    const type = searchParams.get('type'); // Get type filter

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('xatun');
    const collection = db.collection('products');

    // Build the query
    let query = {};
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }

    // Fetch products based on the query
    const products = await collection.find(query).toArray();

    // Transform the data to include proper image URLs
    const transformedProducts = products.map(product => ({
      ...product,
      mainImage: product.mainImage || product.image, // Handle legacy data
      additionalImages: product.additionalImages || []
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}