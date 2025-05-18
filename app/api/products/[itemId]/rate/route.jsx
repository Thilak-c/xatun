import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = "mongodb://localhost:27017/xatun";
const MONGODB_DB = "xatun";

if (!MONGODB_URI || !MONGODB_DB) {
  throw new Error("Database configuration is missing in environment variables.");
}

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(MONGODB_DB);
}

// **GET Request - Fetch Product Rating**
export async function GET(req, { params }) {
  try {
    const db = await connectDB();
    const collection = db.collection("products");
    const { itemId } = params;

    if (!ObjectId.isValid(itemId)) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), { status: 400 });
    }

    const product = await collection.findOne({ itemId });

    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        averageRating: product.averageRating || 0,
        totalRatings: product.ratings ? product.ratings.length : 0,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Internal server error", error: error.message }),
      { status: 500 }
    );
  }
}

// **POST Request - Submit a Rating**
export async function POST(req, { params }) {
  try {
    const { rating } = await req.json();
    const db = await connectDB();
    const collection = db.collection("products");
    const { itemId } = params;

    if (!rating || rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ message: "Invalid rating value" }), { status: 400 });
    }

    const product = await collection.findOne({ itemId });

    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }

    // Ensure ratings array exists
    const newRatings = Array.isArray(product.ratings) ? [...product.ratings, rating] : [rating];

    // Calculate average rating
    const total = newRatings.reduce((sum, r) => sum + r, 0);
    const averageRating = total / newRatings.length;

    await collection.updateOne(
      { itemId },
      { $set: { ratings: newRatings, averageRating: Number(averageRating.toFixed(1)) } }
    );

    return new Response(
      JSON.stringify({
        averageRating: Number(averageRating.toFixed(1)),
        totalRatings: newRatings.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Internal server error", error: error.message }),
      { status: 500 }
    );
  }
}
