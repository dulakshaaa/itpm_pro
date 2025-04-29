const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userManagement_model');

exports.register = async (req, res) => {
    try {
        const { fullName, email, contactNumber, password, nationalIdentityCardNumber } = req.body;
        // Check if user with the same email exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        // Hash the password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            email,
            contactNumber,
            password: hashedPassword,
            nationalIdentityCardNumber
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        // Retrieve user ID from decoded token
        const userId = req.user.userId;

        // Fetch user profile from database using user ID
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update user profile endpoint
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from JWT payload
        const { fullName, contactNumber, nationalIdentityCardNumber } = req.body;

        // Find user by ID and update profile
        const user = await User.findByIdAndUpdate(userId, {
            fullName,
            contactNumber,
            nationalIdentityCardNumber
        }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });s
    }
};

//delete profile
exports.deleteUser = async (req, res) => {
    try {
        // Extract user ID from decoded token
        const userId = req.user.userId;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteUserByID = async (req, res) => {

    const { userID } = req.params;
    try{

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        await User.findByIdAndDelete(userID);
        res.json({ message: 'Owner deleted successfully' });

    } catch (error){
        res.status(500).json({ message: error.message });
    }
}

// controllers/authController.js


// Assuming you have an environment variable for SECRET_KEY
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

exports.verifyToken = (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ isValid: false, message: 'Token required' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ isValid: false, message: 'Token invalid' });
        }
        // Token is valid
        res.json({ isValid: true, message: 'Token valid', user: decoded });
    });
};

//all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};