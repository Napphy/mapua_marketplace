const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/upload', authController.upload);
router.get('/getProducts', authController.getProducts);
router.get('/getProductsByUser', authController.getProductByUser);
router.delete('/delete/:productId' ,authController.deleteItem);
router.put('/edit/:productId', authController.editItem);

module.exports = router;