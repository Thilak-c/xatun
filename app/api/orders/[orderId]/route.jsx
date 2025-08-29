import clientPromise from "@/lib/mongodb";

export async function GET(request, { params }) {
  const { orderId } = await params;

  try {
    const client = await clientPromise;
    const database = client.db('xatun');
    const ordersCollection = database.collection('orders');

    // Find the order by orderId
    const order = await ordersCollection.findOne({ orderId: orderId });
    
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Return the complete order data
    return Response.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return Response.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { orderId } = params;
  const { content } = await request.json();

  try {
    const client = await clientPromise;
    const database = client.db('xatun');
    const ordersCollection = database.collection('orders');

    // Create a new message object
    const newMessage = {
      content,
      timestamp: new Date().toISOString(),
      sender: 'admin',
    };

    // Update the order with the new message
    const result = await ordersCollection.updateOne(
      { orderId: orderId },
      { $push: { messages: newMessage } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json({ error: 'Failed to add message' }, { status: 500 });
  }
}