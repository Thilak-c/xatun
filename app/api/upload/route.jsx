import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    // Destructure the request body
    const {
      itemId,
      name,
      price,
      description,
      image,
      contentType,
      additionalImages,
      category,
      type,
      sizes, // Array of objects: { size: string, stock: number }
    } = await request.json();
console.log("step-1")
    // Validate required fields
    if (
      !itemId ||
      !name ||
      !price ||
      !description ||
      !image ||
      !contentType ||
      !category ||
      !type ||
      !sizes
    ) {
      return NextResponse.json(
        { error: "All fields are required, including category, type, sizes, and colors." },
        { status: 400 }
      );
    }
    console.log("step-2")

    // Ensure additionalImages is an array (optional)
    const formattedAdditionalImages = Array.isArray(additionalImages)
      ? additionalImages
      : [];

    // Validate category (ensure it's a string and not empty)
    if (typeof category !== "string" || category.trim() === "") {
      return NextResponse.json(
        { error: "Category must be a valid string." },
        { status: 400 }
      );
    }

    // Validate type (ensure it's a string and not empty)
    if (typeof type !== "string" || type.trim() === "") {
      return NextResponse.json(
        { error: "Type must be a valid string." },
        { status: 400 }
      );
    }
    console.log("step-3")

    // Validate sizes (ensure it's an array and not empty)
    if (!Array.isArray(sizes) || sizes.length === 0) {
      return NextResponse.json(
        { error: "Sizes must be a non-empty array." },
        { status: 400 }
      );
    }

    // Validate each size object in the sizes array
    for (const sizeObj of sizes) {
      if (
        typeof sizeObj.size !== "string" ||
        sizeObj.size.trim() === "" ||
        typeof sizeObj.stock !== "number" ||
        sizeObj.stock <= 0
      ) {
        return NextResponse.json(
          { error: "Each size object must have a valid size (string) and stock (number greater than 0)." },
          { status: 400 }
        );
      }
    }
    console.log("step-4")

    // Validate colors (ensure it's an array and not empty)
   

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("xatun");
    const collection = db.collection("products");
    console.log("step-5")

    // Insert the product into MongoDB
    const result = await collection.insertOne({
      itemId,
      name,
      price,
      description,
      image, // Main image (Base64)
      contentType,
      additionalImages: formattedAdditionalImages, // Store extra images
      category, // Include the selected category
      type, // Include the selected type
      sizes, // Include sizes with stock
      uploadedAt: new Date(),
    });
    console.log("step-6")

    return NextResponse.json({
      message: "Product uploaded successfully!",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error uploading product:", error);
    return NextResponse.json(
      { error: "Failed to upload product." },
      { status: 500 }
    );
  }
}