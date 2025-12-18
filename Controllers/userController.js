const User = require("../Models/signupModels");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔑 USER LOGIN ATTEMPT');
    console.log('📧 Email:', email);

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ User login successful for:', user.firstname, user.lastname);
    console.log('🎫 JWT token generated');
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });
  } catch (error) {
    console.log('❌ Login error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: "Login failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin – get all users
const getAllUsers = async (req, res) => {
  try {
    console.log('👥 FETCHING ALL USERS FOR ADMIN');
    const users = await User.find().select('-password');
    console.log('📋 Retrieved', users.length, 'users for admin panel');
    users.forEach(user => {
      console.log('👤', user.firstname, user.lastname, '-', user.email);
    });
    res.status(200).json({ 
      success: true, 
      data: users,
      count: users.length 
    });
  } catch (error) {
    console.log('❌ Error fetching users:', error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch users",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  loginUser,
  getAllUsers
};