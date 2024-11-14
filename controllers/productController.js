// productController.js

const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add a new product (Admin only)
exports.addProduct = async (req, res) => {
  try {
    // Only admins can add products
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { name, description, price, stock } = req.body;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a product by ID (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    // Only admins can update products
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    
    const { name, description, price, stock } = req.body;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.updatedAt = Date.now();

    const updatedProduct = await product.save();
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a product by ID (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    // Only admins can delete products
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
