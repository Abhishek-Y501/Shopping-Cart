const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const extractFile = require('../middleware/file');

const routes = express.Router();

routes.get('/products', isAuth.auth, adminController.products);
routes.post('/addProduct', isAuth.auth, extractFile, adminController.addProduct);
routes.delete('/deleteProduct/:id', isAuth.auth, adminController.deleteProduct);
routes.put('/updateProduct/:id', isAuth.auth, extractFile, adminController.updateProduct);

module.exports = routes;