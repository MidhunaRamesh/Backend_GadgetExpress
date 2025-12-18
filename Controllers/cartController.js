const Cart = require("../Models/cartModel");

const addToCart = async (req, res) => {
  try {
    console.log('🛒 ADD TO CART REQUEST RECEIVED');
    console.log('📦 Cart Item Details:', JSON.stringify(req.body, null, 2));
    
    const { userId, productId, productName, price, quantity } = req.body;
    
    // Validate required fields
    if (!userId || !productId || !productName || !price) {
      console.log('❌ Missing required cart fields');
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, productId, productName, price"
      });
    }
    
    // Check if item already exists in cart
    const existingItem = await Cart.findOne({ userId, productId });
    if (existingItem) {
      // Update quantity instead of creating new item
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      
      console.log('✅ Cart item quantity updated!');
      console.log('🆔 Cart Item ID:', existingItem._id);
      
      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated",
        cartItem: existingItem
      });
    }
    
    const cartItem = new Cart(req.body);
    await cartItem.save();
    
    console.log('✅ Item successfully added to cart!');
    console.log('🆔 Cart Item ID:', cartItem._id);
    
    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      cartItem
    });
  } catch (error) {
    console.log('❌ Cart add failed:', error.message);
    console.log('📊 Error details:', error);
    res.status(400).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message
    });
  }
};

const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.find({ userId });
    
    console.log(`🛒 Retrieved ${cartItems.length} cart items for user: ${userId}`);
    
    res.json({
      success: true,
      cartItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { addToCart, getCartItems };