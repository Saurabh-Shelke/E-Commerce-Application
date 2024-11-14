// routes/orderRoutes.js
const express = require('express');
const { placeOrder, getOrderHistory, getOrder, cancelOrder } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, placeOrder);
router.get('/', auth, getOrderHistory);
router.get('/:id', auth, getOrder);
router.delete('/:id', auth, cancelOrder);

module.exports = router;
