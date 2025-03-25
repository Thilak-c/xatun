import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category"); // Get the category from query params

    const client = await clientPromise;
    const db = client.db("xatun");
    const collection = db.collection("products");

    // Build the query
    const query = category ? { category } : {};

    // Fetch products based on the query
    const products = await collection.find(query).toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}