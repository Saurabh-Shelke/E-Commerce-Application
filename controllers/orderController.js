// orderController.js

const Order = require('../models/Order'); // Assuming you have an Order model
const Product = require('../models/Product'); // Assuming you have a Product model
const { validationResult } = require('express-validator');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // Validate request
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    // Check product availability and update stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with id ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      userId: req.userId,
      items,
      totalAmount,
      status: 'pending',
    });
    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// View order history for the authenticated user
exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// View a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Cancel an order by ID
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be canceled' });
    }

    // Update order status to canceled
    order.status = 'canceled';
    await order.save();

    // Restock the items in the canceled order
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    res.status(200).json({ message: 'Order canceled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
