import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

// Ensure upload directory exists
async function ensureUploadDir() {
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
  return uploadDir;
}

// Save file to disk
async function saveFile(file, filename) {
  const uploadDir = await ensureUploadDir();
  const filePath = join(uploadDir, filename);
  
  // Convert file buffer to Uint8Array and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  await writeFile(filePath, buffer);
  return `/uploads/${filename}`; // Return public URL path
}

// Generate unique filename
function generateFilename(originalName, itemId) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${itemId}_${timestamp}_${randomString}.${extension}`;
}

export const config = {
  api: {
    bodyParser: false, // Disable body parser for file uploads
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

    // Parse form data with timeout
    const formData = await Promise.race([
      request.formData(),
      timeoutPromise
    ]);

    console.log("Step-1: Received form data");

    // Extract form fields
    const itemId = formData.get('itemId');
    const name = formData.get('name');
    const price = formData.get('price');
    const description = formData.get('description');
    const category = formData.get('category');
    const type = formData.get('type');
    const sizes = JSON.parse(formData.get('sizes') || '[]');
    
    // Get main image file
    const mainImageFile = formData.get('mainImage');
    const additionalImageFiles = formData.getAll('additionalImages');

    // Validate required fields
    const requiredFields = [
      "itemId", "name", "price", "description", "mainImage",
      "category", "type", "sizes"
    ];

    const missingFields = requiredFields.filter(field => {
      if (field === 'mainImage') return !mainImageFile;
      if (field === 'sizes') return !Array.isArray(sizes) || sizes.length === 0;
      return !formData.get(field);
    });

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    console.log("Step-2: Required fields validated");

    // Validate price
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number." },
        { status: 400 }
      );
    }

    // Validate image files
    if (!mainImageFile || mainImageFile.size === 0) {
      return NextResponse.json(
        { error: "Main image is required and must not be empty." },
        { status: 400 }
      );
    }

    // Check file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(mainImageFile.type)) {
      return NextResponse.json(
        { error: "Main image must be JPEG, PNG, or WebP format." },
        { status: 400 }
      );
    }

    // Check file sizes (max 5MB per image)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (mainImageFile.size > maxSize) {
      return NextResponse.json(
        { error: "Main image size must be less than 5MB." },
        { status: 400 }
      );
    }

    // Validate additional images
    const validAdditionalImages = [];
    for (const file of additionalImageFiles) {
      if (file && file.size > 0) {
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { error: "Additional images must be JPEG, PNG, or WebP format." },
            { status: 400 }
          );
        }
        if (file.size > maxSize) {
          return NextResponse.json(
            { error: "Additional images must be less than 5MB each." },
            { status: 400 }
          );
        }
        validAdditionalImages.push(file);
      }
    }

    console.log("Step-3: Image validation completed");

    // Validate category and type
    if (typeof category !== "string" || category.trim() === "") {
      return NextResponse.json(
        { error: "Category must be a non-empty string." },
        { status: 400 }
      );
    }

    if (typeof type !== "string" || type.trim() === "") {
      return NextResponse.json(
        { error: "Type must be a non-empty string." },
        { status: 400 }
      );
    }

    // Validate sizes array
    if (!Array.isArray(sizes) || sizes.length === 0) {
      return NextResponse.json(
        { error: "Sizes must be a non-empty array." },
        { status: 400 }
      );
    }

    // Validate each size object
    for (const sizeObj of sizes) {
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

    console.log("Step-4: All validations completed");

    // Save main image
    const mainImageFilename = generateFilename(mainImageFile.name, itemId);
    const mainImagePath = await saveFile(mainImageFile, mainImageFilename);

    // Save additional images
    const additionalImagePaths = [];
    for (const file of validAdditionalImages) {
      const filename = generateFilename(file.name, itemId);
      const filePath = await saveFile(file, filename);
      additionalImagePaths.push(filePath);
    }

    console.log("Step-5: Images saved to disk");

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

    // Prepare document with file paths instead of Base64
    const document = {
      itemId: itemId.trim(),
      name: name.trim(),
      price: priceNum,
      description: description.trim(),
      mainImage: mainImagePath,
      additionalImages: additionalImagePaths,
      category: category.trim(),
      type: type.trim(),
      sizes: sizes,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active"
    };

    console.log("Step-6: Prepared document for insertion");

    // Insert with retry and timeout
    const result = await withRetry(
      () => Promise.race([
        collection.insertOne(document),
        timeoutPromise
      ]),
      "document insertion"
    );

    console.log("Step-7: Product inserted successfully");
    
    return NextResponse.json({
      success: true,
      message: "Product uploaded successfully!",
      insertedId: result.insertedId,
      mainImage: mainImagePath,
      additionalImages: additionalImagePaths
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