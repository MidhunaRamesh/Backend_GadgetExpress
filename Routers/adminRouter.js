const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getAllUsers } = require("../Controllers/userController");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔑 ADMIN LOGIN ATTEMPT');
    console.log('👤 Username:', username);

    // Validate input
    if (!username || !password) {
      console.log('❌ Admin login failed - Missing credentials');
      return res.status(400).json({ 
        success: false, 
        message: "Username and password are required" 
      });
    }

    if (username === "admin" && password === "admin123") {
      // Generate JWT token for admin
      const token = jwt.sign(
        { userId: 'admin', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      console.log('✅ Admin login successful');
      console.log('🎫 Admin JWT token generated');
      
      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        token,
        user: {
          username: 'admin',
          role: 'admin'
        }
      });
    }

    console.log('❌ Admin login failed - Invalid credentials');
    res.status(401).json({ 
      success: false, 
      message: "Invalid admin credentials" 
    });
  } catch (error) {
    console.log('❌ Admin login error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: "Admin login failed. Please try again.", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/admin/users
router.get("/users", getAllUsers);

module.exports = router;
