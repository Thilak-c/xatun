import { MongoClient } from 'mongodb';

// GET: Fetch all messages for an order
export async function GET(request, { params }) {
  const { orderId } = params;
  const uri = "mongodb://localhost:27017/xatun";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('xatun'); // Replace with your database name
    const ordersCollection = database.collection('orders');

    // Find the order by orderId
    const order = await ordersCollection.findOne({ orderId });

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Return the messages array (default to empty array if messages don't exist)
    return Response.json(order.messages || []);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  } finally {
    await client.close();
  }
}

// POST: Add a new message to the order
export async function POST(request, { params }) {
  const { orderId } = params;
  const { content } = await request.json();
  const uri = "mongodb://localhost:27017/xatun";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('xatun'); // Replace with your database name
    const ordersCollection = database.collection('orders');

    // Create a new message object
    const newMessage = {
      content,
      timestamp: new Date().toISOString(),
      sender: 'admin', // You can change this to 'user' if needed
    };

    // Update the order with the new message
    const result = await ordersCollection.updateOne(
      { orderId },
      { $push: { messages: newMessage } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json({ error: 'Failed to add message' }, { status: 500 });
  } finally {
    await client.close();
  }
}