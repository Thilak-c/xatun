// app/api/images/[id]/route.js
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb'; // Import ObjectId
import clientPromise from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    // Destructure and await params
    const { id } = params;

    // Validate the ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('xatun');
    const collection = db.collection('products');

    // Find the image by ID
    const image = await collection.findOne({ _id: new ObjectId(id) });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}