import clientPromise from "@/lib/mongodb";

export async function PUT(request) {
  try {
    const { itemId, size, quantity } = await request.json();
    
    if (!itemId || !size || !quantity) {
      return Response.json({ 
        success: false, 
        error: 'Missing required fields: itemId, size, quantity' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const database = client.db('xatun');
    const productsCollection = database.collection('products');

    // Find the product and update the specific size stock
    const result = await productsCollection.updateOne(
      { 
        itemId: itemId,
        "sizes.size": size 
      },
      { 
        $inc: { "sizes.$.stock": -quantity } 
      }
    );

    if (result.matchedCount === 0) {
      return Response.json({ 
        success: false, 
        error: 'Product or size not found' 
      }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      return Response.json({ 
        success: false, 
        error: 'Stock update failed' 
      }, { status: 500 });
    }

    // Get updated product to verify stock
    const updatedProduct = await productsCollection.findOne({ itemId: itemId });
    const updatedSize = updatedProduct.sizes.find(s => s.size === size);

    return Response.json({
      success: true,
      message: 'Stock updated successfully',
      newStock: updatedSize.stock,
      productId: itemId,
      size: size
    });

  } catch (error) {
    console.error('Error updating product stock:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to update stock' 
    }, { status: 500 });
  }
} 