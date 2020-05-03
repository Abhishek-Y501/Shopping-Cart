const express = require('express');
const shopControllers = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

const routes = express.Router();

routes.get('/getCart', isAuth.auth, shopControllers.getCart);
routes.post('/addToCart', isAuth.auth, shopControllers.addToCart);
routes.post('/removeFromCart', isAuth.auth, shopControllers.removeFromCart);
routes.get('/getCartCount', isAuth.auth, shopControllers.getCartCount);
routes.post('/addOrder', isAuth.auth, shopControllers.addOrder);
routes.get('/getOrders', isAuth.auth, shopControllers.getOrders);
routes.get('/checkout', isAuth.auth, shopControllers.checkout);

module.exports = routes;