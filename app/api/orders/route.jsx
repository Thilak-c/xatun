import clientPromise from "@/lib/mongodb";

// Fetch all orders
export async function GET() {
  try {
    const client = await clientPromise;
    const database = client.db('xatun');
    const ordersCollection = database.collection('orders');

    // Fetch all orders
    const orders = await ordersCollection.find({}).toArray();

    return Response.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// Update order status
export async function PUT(request) {
  try {
    const { orderId, status } = await request.json();
    const client = await clientPromise;
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
  }
}

export async function POST(request) {
  try {
    const {
      productName,
      amount,
      paymentId,
      itemId,
      orderId, // This comes from Razorpay
      itemImage,
      address,
      size,
      quantity,
      color
    } = await request.json();

    const client = await clientPromise;
    const database = client.db('xatun');
    const ordersCollection = database.collection('orders');

    // Create order object with all the data from checkout
    const order = {
      orderId: orderId, // Use the Razorpay order ID
      productName,
      size,
      quantity: quantity || 1,
      color: color || 'N/A',
      amount,
      paymentId,
      itemId,
      itemImage,
      address,
      status: 'pending',
      createdAt: new Date().toISOString(),
      messages: [] // Initialize empty messages array
    };

    // Insert order into MongoDB
    const result = await ordersCollection.insertOne(order);
    
    if (result.acknowledged) {
      return Response.json({ 
        success: true, 
        orderId: order.orderId,
        message: 'Order created successfully' 
      });
    } else {
      throw new Error('Failed to insert order into database');
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to create order',
      details: error.message 
    }, { status: 500 });
  }
}