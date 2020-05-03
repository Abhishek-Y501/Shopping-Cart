const Product = require('../models/product');
const Response = require('../util/response').Response;
const User = require('../models/user');
const Order = require('../models/order');


exports.addToCart = ((req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId).then(product => {
        return req.users.addToCart(product);
    }).then(result => {
        res.status(201).json(Response('Success', 'Product added to cart successfully!', 1, 'addToCart_success', result));
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
});

exports.getCart = ((req, res, next) => {
    req.users.populate('Cart.items.productId').execPopulate()
        .then(user => {
            const products = user.Cart.items;
            res.status(201).json(Response('Success', 'Product retrived successfully!', 1, 'getCart_success', products));
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
});

exports.getCartCount = ((req, res, next) => {
    req.users.populate('Cart.items.productId').execPopulate().then(user => {
        const products = user.Cart.items.length;
        res.status(201).json(Response('Success', 'Product retrived successfully!', 1, 'getCartCount_success', products));
    })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
});

exports.removeFromCart = ((req, res, next) => {
    const productId = req.body.productId;
    req.users.removeFromCart(productId).then(result => {
        res.status(201).json(Response('Success', 'Product removed from cart!', 1, 'removeFromCart_success', result));
    })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
})

exports.getOrders = ((req, res, next) => {
    Order.find({ 'user.userId': req.user.userId }).then(orders => {
        res.status(200).json(Response('Success', 'Orders retrived successfully!', 1, 'getOrders_success', orders));
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
});

exports.checkout = ((req, res, next) => {
    req.users.populate('Cart.items.productId').execPopulate()
        .then(user => {
            const products = user.Cart.items;
            let total = 0;
            products.forEach(i => {
                total += i.quantity * i.productId.Price
            })
            res.status(200).json(Response('Success', 'Product Details!', 1, 'checkout_success', { products: products, total: total }));
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
})

exports.addOrder = ((req, res, next) => {
    console.log(req.body);
    req.users.populate('Cart.items.productId').execPopulate()
        .then(user => {
            const product = user.Cart.items.map(cp => {
                return { quantity: cp.quantity, product: { ...cp.productId._doc } }
            })

            const order = new Order(
                {
                    products: product,
                    user: {
                        email: req.user.email,
                        userId: req.user.userId
                    },
                    address: {
                        name: req.body.name,
                        street: req.body.street,
                        city: req.body.city,
                        state: req.body.state,
                        zip: req.body.zip,
                        number:req.body.number
                    }
                }
            )
            return order.save();
        }).then(result => {
            return req.users.clearCart();
        }).then(products => {
            res.status(201).json(Response('Success', 'Order successfully added!', 1, 'addOrder_success', products));
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
})
