const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getProductById, deleteProduct, updateProduct } = require('../controllers/products');

router.post('/add', addProduct);

router.get('/getAll', getAllProducts);

router.get('/:id', getProductById);

router.delete('/:id', deleteProduct);

router.put('/:id', updateProduct);

module.exports = router;
