const mongoose = require("mongoose");
require("dotenv").config();

// Test database connection and data saving
const testConnection = async () => {
  try {
    console.log("🔍 Testing MongoDB connection...");
    
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    
    console.log("✅ MongoDB connected successfully");
    
    // Test User model
    const User = require("./Models/signupModels");
    const testUser = new User({
      firstname: "Test",
      lastname: "User",
      email: "test@example.com",
      phone: 1234567890,
      password: "testpassword"
    });
    
    const savedUser = await testUser.save();
    console.log("✅ Test user saved:", savedUser._id);
    
    // Test Contact model
    const Contact = require("./Models/contactModel");
    const testContact = new Contact({
      name: "Test Contact",
      email: "contact@example.com",
      phone: "1234567890",
      subject: "Test Subject",
      message: "Test message"
    });
    
    const savedContact = await testContact.save();
    console.log("✅ Test contact saved:", savedContact._id);
    
    // Test Cart model
    const Cart = require("./Models/cartModel");
    const testCart = new Cart({
      userId: "test-user-id",
      productId: "test-product-id",
      productName: "Test Product",
      price: 99.99,
      quantity: 1
    });
    
    const savedCart = await testCart.save();
    console.log("✅ Test cart item saved:", savedCart._id);
    
    console.log("🎉 All models working correctly!");
    
    // Clean up test data
    await User.findByIdAndDelete(savedUser._id);
    await Contact.findByIdAndDelete(savedContact._id);
    await Cart.findByIdAndDelete(savedCart._id);
    
    console.log("🧹 Test data cleaned up");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    process.exit(1);
  }
};

testConnection();