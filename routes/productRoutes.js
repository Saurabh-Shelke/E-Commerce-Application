const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
