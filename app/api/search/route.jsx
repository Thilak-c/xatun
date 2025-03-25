import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("xatun"); // Replace with your database name
    const products = await db
      .collection("products") // Replace with your collection name
      .find({ name: { $regex: query, $options: "i" } }) // Case-insensitive search
      .toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products from MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}