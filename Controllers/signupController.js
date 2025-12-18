const User = require("./../Models/signupModels");
const bcrypt = require('bcryptjs');

const signupUser = async (req, res) => {
    try {
        const { firstname, lastname, email, phone, password } = req.body;
        
        console.log('🎆 NEW USER REGISTRATION');
        console.log('📛 Name:', firstname, lastname);
        console.log('📧 Email:', email);
        console.log('📱 Phone:', phone);
        
        // Validate required fields
        if (!firstname || !lastname || !email || !phone || !password) {
            console.log('❌ Registration failed - Missing required fields');
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Registration failed - Invalid email format');
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email format" 
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ Registration failed - Email already exists:', email);
            return res.status(400).json({ 
                success: false, 
                message: "Email already registered" 
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔒 Password hashed successfully');
        
        const newUser = new User({
            firstname,
            lastname,
            email,
            phone,
            password: hashedPassword,
        });
        
        console.log('💾 Saving new user to database...');
        const savedUser = await newUser.save();
        
        console.log('✅ User registered successfully with ID:', savedUser._id);
        
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: savedUser._id,
                firstname: savedUser.firstname,
                lastname: savedUser.lastname,
                email: savedUser.email,
                phone: savedUser.phone
            }
        });
    } catch (error) {
        console.log('❌ User registration failed:', error.message);
        res.status(500).json({ 
            success: false, 
            message: "Registration failed. Please try again.", 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
module.exports = {
    signupUser,
};