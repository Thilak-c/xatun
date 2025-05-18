import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";
// import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request, { params }) {
    try {
        const { itemId } = params;

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("xatun");
        const collection = db.collection("products");

        // Find the product by itemId
        const product = await collection.findOne({ itemId });

        if (product) {
            return NextResponse.json(product);
        } else {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Failed to fetch product." }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { itemId } = params;
        const { name, price , category, description } = await request.json();

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("xatun");
        const collection = db.collection("products");

        // Update the product
        const result = await collection.updateOne(
            { itemId },
            { $set: { name, price, category, description } }
        );

        if (result.modifiedCount === 1) {
            return NextResponse.json({ message: "Product updated successfully!" });
        } else {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
    }
}
export async function DELETE(request, { params }) {
    try {
        const { itemId } = params;

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("xatun");
        const collection = db.collection("products");

        // Delete the product
        const result = await collection.deleteOne({ itemId });

        if (result.deletedCount === 1) {
            return NextResponse.json({ message: "Product deleted successfully!" });
        } else {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
    }
}
