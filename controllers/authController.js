// authController.js

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model
const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// User registration
exports.register = async (req, res) => {
  try {
    // Validate input
    await body('username').notEmpty().run(req);
    await body('email').isEmail().run(req);
    await body('password').isLength({ min: 6 }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    // Validate input
    await body('email').isEmail().run(req);
    await body('password').notEmpty().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access forbidden: Admins only' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
