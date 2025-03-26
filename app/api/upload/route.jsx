import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
    try {
        // Parse the request body
        const body = await request.json();

        console.log("Step-1: Received request data.");

        // Validate required fields
        const requiredFields = [
            "itemId", "name", "price", "description", "image",
            "contentType", "category", "type", "sizes"
        ];

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `${field} is required.` },
                    { status: 400 }
                );
            }
        }

        console.log("Step-2: Required fields validated.");

        // Validate 'price' as a number
        const price = Number(body.price);
        if (isNaN(price) || price <= 0) {
            return NextResponse.json(
                { error: "Price must be a valid positive number." },
                { status: 400 }
            );
        }

        // Ensure additionalImages is an array (optional)
        const additionalImages = Array.isArray(body.additionalImages)
            ? body.additionalImages
            : [];

        // Validate category and type
        if (typeof body.category !== "string" || body.category.trim() === "") {
            return NextResponse.json(
                { error: "Category must be a non-empty string." },
                { status: 400 }
            );
        }

        if (typeof body.type !== "string" || body.type.trim() === "") {
            return NextResponse.json(
                { error: "Type must be a non-empty string." },
                { status: 400 }
            );
        }

        console.log("Step-3: Category and type validated.");

        // Validate sizes array
        if (!Array.isArray(body.sizes) || body.sizes.length === 0) {
            return NextResponse.json(
                { error: "Sizes must be a non-empty array." },
                { status: 400 }
            );
        }

        // Validate each size object in the sizes array
        for (const sizeObj of body.sizes) {
            if (
                typeof sizeObj.size !== "string" ||
                sizeObj.size.trim() === "" ||
                typeof sizeObj.stock !== "number" ||
                sizeObj.stock < 0
            ) {
                return NextResponse.json(
                    { error: "Each size object must have a valid size (string) and stock (number >= 0)." },
                    { status: 400 }
                );
            }
        }

        console.log("Step-4: Sizes validated.");

        // Connect to MongoDB
        let client;
        try {
            client = await clientPromise;
            if (!client) throw new Error("MongoDB client is undefined.");
        } catch (dbConnectError) {
            console.error("MongoDB Connection Error:", dbConnectError);
            return NextResponse.json(
                { error: "Database connection failed." },
                { status: 500 }
            );
        }

        const db = client.db("xatun");
        const collection = db.collection("products");

        console.log("Step-5: Connected to MongoDB.");

        // Insert product into MongoDB
        try {
            const result = await collection.insertOne({
                itemId: body.itemId,
                name: body.name,
                price: price,
                description: body.description,
                image: body.image,
                contentType: body.contentType,
                additionalImages: additionalImages,
                category: body.category,
                type: body.type,
                sizes: body.sizes,
                uploadedAt: new Date(),
            });

            console.log("Step-6: Product inserted successfully.");
            return NextResponse.json({
                message: "Product uploaded successfully!",
                insertedId: result.insertedId,
            });

        } catch (dbInsertError) {
            console.error("Database Insert Error:", dbInsertError);
            return NextResponse.json(
                { error: "Failed to insert product into the database." },
                { status: 500 }
            );
        }

    } catch (unexpectedError) {
        console.error("Unexpected Error:", unexpectedError);
        return NextResponse.json(
            { error: "An unexpected error occurred. Please try again later." },
            { status: 500 }
        );
    }
}
