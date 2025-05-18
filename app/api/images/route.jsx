// app/api/images/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name'); // Get the search query

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('xatun');
    const collection = db.collection('products');

    // Build the query
    const query = name ? { name: { $regex: name, $options: 'i' } } : {};

    // Fetch images based on the query
    const images = await collection.find(query).toArray();

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}