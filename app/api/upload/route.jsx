import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

// Cached connection
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Use environment variable or fallback to local
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/xatun";

  const client = new MongoClient(uri, {
    connectTimeoutMS: 5000,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 50,
    retryWrites: true,
    retryReads: true
  });

  try {
    await client.connect();
    const dbName = new URL(uri).pathname.substring(1) || 'xatun';
    const db = client.db(dbName);
    
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}
// Retry mechanism for database operations
async function withRetry(fn, operationName, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      console.error(`Final failure after retries for ${operationName}:`, error);
      throw error;
    }
    console.warn(`Retrying ${operationName} (${retries} attempts left)...`);
    await new Promise(res => setTimeout(res, delay));
    return withRetry(fn, operationName, retries - 1, delay * 2);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Increase if you have large image payloads
    },
    externalResolver: true,
    responseLimit: false,
  },
  maxDuration: 30, // 30 seconds timeout for Vercel
};

export async function POST(request) {
  let client;
  
  try {
    // Set up timeout for the entire request processing
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request processing timed out after 25 seconds"));
      }, 25000);
    });

    // Parse request body with timeout
    const body = await Promise.race([
      request.json(),
      timeoutPromise
    ]);

    console.log("Step-1: Received and parsed request data");

    // Validate required fields
    const requiredFields = [
      "itemId", "name", "price", "description", "image",
      "contentType", "category", "type", "sizes"
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    console.log("Step-2: Required fields validated");

    // Validate price
    const price = Number(body.price);
    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number." },
        { status: 400 }
      );
    }

    // Process additional images
    const additionalImages = Array.isArray(body.additionalImages)
      ? body.additionalImages.filter(img => typeof img === 'string')
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

    console.log("Step-3: Category and type validated");

    // Validate sizes array
    if (!Array.isArray(body.sizes) || body.sizes.length === 0) {
      return NextResponse.json(
        { error: "Sizes must be a non-empty array." },
        { status: 400 }
      );
    }

    // Validate each size object
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

    console.log("Step-4: Sizes validated");

    // Database operations with retry and timeout
    const { client: connectedClient, db } = await withRetry(
      () => Promise.race([
        connectToDatabase(),
        timeoutPromise
      ]),
      "database connection"
    );
    
    client = connectedClient;
    const collection = db.collection("products");

    // Prepare document with additional metadata
    const document = {
      itemId: body.itemId,
      name: body.name.trim(),
      price: price,
      description: body.description.trim(),
      image: body.image,
      contentType: body.contentType,
      additionalImages: additionalImages,
      category: body.category.trim(),
      type: body.type.trim(),
      sizes: body.sizes,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active"
    };

    console.log("Step-5: Prepared document for insertion");

    // Insert with retry and timeout
    const result = await withRetry(
      () => Promise.race([
        collection.insertOne(document),
        timeoutPromise
      ]),
      "document insertion"
    );

    console.log("Step-6: Product inserted successfully");
    
    return NextResponse.json({
      success: true,
      message: "Product uploaded successfully!",
      insertedId: result.insertedId,
    }, { status: 201 });

  } catch (error) {
    console.error("API Error:", error);
    
    if (error.message.includes("timed out")) {
      return NextResponse.json(
        { 
          success: false,
          error: "Request processing timed out",
          message: "The operation took too long to complete. Please try again with a smaller payload or fewer operations."
        },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Database operation failed",
        message: "An error occurred while processing your request. Please try again later."
      },
      { status: 500 }
    );
  } finally {
    // Only close the connection if it's not cached
    if (client && client !== cachedClient) {
      try {
        await client.close();
      } catch (closeError) {
        console.error("Error closing connection:", closeError);
      }
    }
  }
}