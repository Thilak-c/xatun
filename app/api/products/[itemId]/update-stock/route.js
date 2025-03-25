import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function PATCH(request, { params }) {
  try {
    const { itemId } = params; // Product ID from the URL
    const { size, quantity } = await request.json(); // Size and quantity to reduce

    // Validate input
    if (!itemId || !size || !quantity) {
      return NextResponse.json(
        { error: "Product ID, size, and quantity are required." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("xatun"); // Replace with your database name
    const collection = db.collection("products"); // Replace with your collection name

    // Find the product
    const product = await collection.findOne({ itemId: itemId });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // Find the size and update its stock
    const updatedSizes = product.sizes.map((sizeObj) => {
      if (sizeObj.size === size) {
        return { ...sizeObj, stock: sizeObj.stock - quantity };
      }
      return sizeObj;
    });

    // Update the product in the database
    await collection.updateOne(
      { itemId: itemId },
      { $set: { sizes: updatedSizes } }
    );

    return NextResponse.json({ message: "Stock updated successfully." });
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Failed to update stock." },
      { status: 500 }
    );
  }
}