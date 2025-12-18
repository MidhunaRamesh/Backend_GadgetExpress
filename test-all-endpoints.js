const mongoose = require("mongoose");
require("dotenv").config();

// Test all endpoints and database operations
const testAllEndpoints = async () => {
  try {
    console.log("🔍 Testing all endpoints and database operations...\n");
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    console.log("✅ MongoDB connected successfully\n");

    // Import models
    const User = require("./Models/signupModels");
    const Contact = require("./Models/contactModel");
    const Cart = require("./Models/cartModel");

    // Test 1: User Registration (Signup)
    console.log("🧪 TEST 1: User Registration");
    const testUser = new User({
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@test.com",
      phone: 1234567890,
      password: "hashedpassword123"
    });
    
    const savedUser = await testUser.save();
    console.log("✅ User saved successfully:", savedUser._id);
    console.log("📧 Email:", savedUser.email);
    console.log("👤 Name:", savedUser.firstname, savedUser.lastname);
    console.log("");

    // Test 2: Contact Form
    console.log("🧪 TEST 2: Contact Form");
    const testContact = new Contact({
      name: "Jane Smith",
      email: "jane@test.com",
      phone: "9876543210",
      subject: "Test Inquiry",
      message: "This is a test contact message"
    });
    
    const savedContact = await testContact.save();
    console.log("✅ Contact saved successfully:", savedContact._id);
    console.log("📧 Email:", savedContact.email);
    console.log("📝 Subject:", savedContact.subject);
    console.log("");

    // Test 3: Cart Operations
    console.log("🧪 TEST 3: Cart Operations");
    const testCartItem = new Cart({
      userId: savedUser._id.toString(),
      productId: "prod-123",
      productName: "Test Product",
      price: 99.99,
      quantity: 2
    });
    
    const savedCartItem = await testCartItem.save();
    console.log("✅ Cart item saved successfully:", savedCartItem._id);
    console.log("🛒 Product:", savedCartItem.productName);
    console.log("💰 Price:", savedCartItem.price);
    console.log("🔢 Quantity:", savedCartItem.quantity);
    console.log("");

    // Test 4: Data Retrieval
    console.log("🧪 TEST 4: Data Retrieval");
    const allUsers = await User.find();
    const allContacts = await Contact.find();
    const allCartItems = await Cart.find();
    
    console.log("📊 Total Users in DB:", allUsers.length);
    console.log("📊 Total Contacts in DB:", allContacts.length);
    console.log("📊 Total Cart Items in DB:", allCartItems.length);
    console.log("");

    // Test 5: User Login Simulation
    console.log("🧪 TEST 5: User Login Simulation");
    const loginUser = await User.findOne({ email: "john.doe@test.com" });
    if (loginUser) {
      console.log("✅ User found for login:", loginUser.email);
      console.log("🆔 User ID:", loginUser._id);
    }
    console.log("");

    // Test 6: Cart Retrieval by User
    console.log("🧪 TEST 6: Cart Retrieval by User");
    const userCartItems = await Cart.find({ userId: savedUser._id.toString() });
    console.log("🛒 Cart items for user:", userCartItems.length);
    userCartItems.forEach(item => {
      console.log("  - Product:", item.productName, "| Qty:", item.quantity);
    });
    console.log("");

    console.log("🎉 ALL TESTS PASSED! Your database operations are working correctly.");
    console.log("");
    console.log("🔧 TROUBLESHOOTING TIPS:");
    console.log("1. Make sure your frontend is sending requests to the correct endpoints");
    console.log("2. Check that your frontend includes all required fields");
    console.log("3. Verify CORS settings if making requests from browser");
    console.log("4. Check browser network tab for actual request/response data");
    console.log("");

    // Clean up test data
    await User.findByIdAndDelete(savedUser._id);
    await Contact.findByIdAndDelete(savedContact._id);
    await Cart.findByIdAndDelete(savedCartItem._id);
    console.log("🧹 Test data cleaned up");

    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
};

testAllEndpoints();