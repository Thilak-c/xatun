import { MongoClient } from 'mongodb';

// Fetch all orders
export async function GET() {
  const uri = "mongodb://localhost:27017/xatun";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('xatun');
    const ordersCollection = database.collection('orders');

    // Fetch all orders
    const orders = await ordersCollection.find({}).toArray();

    return Response.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  } finally {
    await client.close();
  }
}

// Update order status
export async function PUT(request) {
  const { orderId, status } = await request.json();
  const uri = "mongodb://localhost:27017/xatun";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('xatun');
    const ordersCollection = database.collection('orders');

    // Update order status
    const result = await ordersCollection.updateOne(
      { orderId },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return Response.json({ error: 'Failed to update order' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  const {
    productName,
    amount,
    paymentId,
    itemId,
    itemImage,
    address, // Include address
    size
  } = await request.json();

  const uri = "mongodb://localhost:27017/xatun";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('xatun');
    const ordersCollection = database.collection('orders');

    console.log(productName,
      amount,
      paymentId,
      itemId,
      itemImage,)
    // Create order object
    const order = {
      orderId: `ORD-${Date.now()}`, // Generate a unique order ID
      productName,
      size,
      amount,
      paymentId,
      itemId,
      itemImage,
      address, // Include address
      status: 'pending', // Default status
      createdAt: new Date().toISOString(),
    };

    // Insert order into MongoDB
    const result = await ordersCollection.insertOne(order);
    console.log("Done")
    return Response.json({ success: true, orderId: order.orderId });
  } catch (error) {
    console.error('Error creating order:', error);
    return Response.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  } finally {
    await client.close();
  }
}