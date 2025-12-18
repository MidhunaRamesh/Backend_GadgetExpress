const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));



// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.path}`);
  console.log('📅 Time:', new Date().toLocaleString());
  if (Object.keys(req.body).length > 0) {
    console.log('📦 Request Body:');
    console.log(JSON.stringify(req.body, null, 2));
  }
  console.log('-----------------------------------');
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n🔥 ${req.method} ${req.url}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('🔐 INPUT DATA:');
    console.log(JSON.stringify(req.body, null, 2));
    
    // Highlight specific fields
    if (req.body.email) console.log('📧 Email:', req.body.email);
    if (req.body.password) console.log('🔑 Password:', req.body.password);
    if (req.body.username) console.log('👤 Username:', req.body.username);
    if (req.body.name) console.log('📛 Name:', req.body.name);
    if (req.body.phone) console.log('📱 Phone:', req.body.phone);
    if (req.body.productName) console.log('📦 Product:', req.body.productName);
    if (req.body.price) console.log('💰 Price:', req.body.price);
    if (req.body.quantity) console.log('🔢 Quantity:', req.body.quantity);
  }
  
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('🔍 Query Parameters:', req.query);
  }
  
  console.log('⏰ Time:', new Date().toLocaleString());
  console.log('═'.repeat(60));
  next();
});

// Database operation logging middleware
const originalSave = mongoose.Model.prototype.save;
mongoose.Model.prototype.save = function() {
  console.log('💾 SAVING TO DATABASE:', this.constructor.modelName);
  console.log('📊 Data being saved:', JSON.stringify(this.toObject(), null, 2));
  return originalSave.apply(this, arguments);
};

/* =========================
   TEST ROUTE (IMPORTANT)
========================= */
app.get("/api/test", (req, res) => {
  console.log('✨ TEST ENDPOINT HIT - LOGGING IS WORKING!');
  res.json({ message: "Backend is working correctly ✅", logging: "Active 📝" });
});

// Test POST endpoint to verify input logging
app.post("/api/test-input", (req, res) => {
  console.log('✨ TEST INPUT ENDPOINT - Data received!');
  res.json({ message: "Input logging test successful", receivedData: req.body });
});

/* =========================
   ROUTES
========================= */
app.use("/api/signup", require("./Routers/signupRouter"));
app.use("/api/contact", require("./Routers/contactRouter"));
app.use("/api/auth", require("./Routers/authRouter"));
app.use("/api/admin", require("./Routers/adminRouter"));
app.use("/api/cart", require("./Routers/cartRouter"));

// Product Management Routes
app.post("/api/products", async (req, res) => {
  try {
    console.log('🎆 PRODUCT CREATION REQUEST');
    const Product = require("./Models/productModel");
    const product = new Product(req.body);
    await product.save();
    console.log('✅ Product created successfully:', product.name);
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.log('❌ Product creation failed:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const Product = require("./Models/productModel");
    const products = await Product.find();
    console.log('📋 Retrieved', products.length, 'products from database');
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



/* =========================
   USER MANAGEMENT ENDPOINT
========================= */
app.get("/api/users", async (req, res) => {
  try {
    const User = require("./Models/signupModels");
    const users = await User.find().select('-password');
    console.log('👥 Retrieved', users.length, 'users from database');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* =========================
   DATABASE STATS ENDPOINT
========================= */
app.get("/api/stats", async (req, res) => {
  try {
    const User = require("./Models/signupModels");
    const Contact = require("./Models/contactModel");
    
    const userCount = await User.countDocuments();
    const contactCount = await Contact.countDocuments();
    
    res.json({
      success: true,
      stats: {
        users: userCount,
        contacts: contactCount,
        totalRecords: userCount + contactCount,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch database stats",
      error: error.message
    });
  }
});

// Database verification endpoint
app.get("/api/verify-db", async (req, res) => {
  try {
    console.log('🔍 VERIFYING DATABASE CONNECTION AND DATA...');
    
    const User = require("./Models/signupModels");
    const Contact = require("./Models/contactModel");
    const Cart = require("./Models/cartModel");
    
    // Get actual data samples
    const users = await User.find().limit(5).select('-password');
    const contacts = await Contact.find().limit(5);
    const cartItems = await Cart.find().limit(5);
    
    const verification = {
      success: true,
      database: {
        connected: mongoose.connection.readyState === 1,
        name: mongoose.connection.name,
        host: mongoose.connection.host
      },
      collections: {
        users: {
          count: await User.countDocuments(),
          sample: users
        },
        contacts: {
          count: await Contact.countDocuments(),
          sample: contacts
        },
        cart: {
          count: await Cart.countDocuments(),
          sample: cartItems
        }
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Database verification completed');
    console.log('📊 Users in DB:', verification.collections.users.count);
    console.log('📊 Contacts in DB:', verification.collections.contacts.count);
    console.log('📊 Cart Items in DB:', verification.collections.cart.count);
    
    res.json(verification);
  } catch (error) {
    console.log('❌ Database verification failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* =========================
   404 HANDLER (FIX JSON ERROR)
========================= */
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.path,
    method: req.method
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.message);
  console.error("Stack:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

/* =========================
   DATABASE CONNECTION
========================= */
const getMongoUri = () => {
  const raw = process.env.MONGO_URL || process.env.MONGODB_URI || '';
  const uri = raw.trim().replace(/^['"]|['"]$/g, '');
  if (!uri) {
    throw new Error('Missing MONGO_URL or MONGODB_URI environment variable');
  }
  if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
    throw new Error(`Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://". Got: "${uri.slice(0, 16)}..."`);
  }
  return uri;
};

const connectDB = async () => {
  try {
    const uri = getMongoUri();
    console.log('🔗 MongoDB URI scheme:', uri.startsWith('mongodb+srv://') ? 'mongodb+srv' : 'mongodb');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.log("\n🔧 Troubleshooting steps:");
    console.log("1. 🌐 Add your IP to MongoDB Atlas whitelist:");
    console.log("   → Go to Network Access in Atlas Dashboard");
    console.log("   → Click 'Add IP Address' → 'Add Current IP'");
    console.log("2. 🔗 Verify connection string in .env file (no quotes, no spaces)");
    console.log("3. 🌍 Check internet connection");
    console.log("4. 🔑 Verify database user credentials");
    process.exit(1);
  }
};

connectDB();

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n'.repeat(3));
  console.log('🚀'.repeat(20));
  console.log(`🚀 SERVER STARTED SUCCESSFULLY!`);
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`📊 Logging is ACTIVE - All requests will be logged`);
  console.log(`🔍 Test your logging by visiting: http://localhost:${PORT}/api/test`);
  console.log('🚀'.repeat(20));
  console.log('\n📝 WAITING FOR REQUESTS...');
  console.log('═'.repeat(60));
});
