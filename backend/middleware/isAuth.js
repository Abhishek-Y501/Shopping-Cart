const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.auth = ((req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        console.log('unAuthorized token!');
        const error = new Error('unAuthorized Toke.')
        error.statusCode = 404;
        throw error;
    }

    try {
        const decodedToken = jwt.verify(token, 'shopping_kart_secret_key');
        req.user = {
            email: decodedToken.email,
            userId: decodedToken.userId
        };
        User.findById(req.user.userId)
            .then(user => {
                if (!user) {
                    return next();
                }
                req.users = user;
                next();
            })
            .catch(err => {
                next(new Error(err));
            });
    } catch (err) {
        console.log('Invalid Token!');
        const error = new Error('Invalid Token')
        error.statusCode = 404;
        next(error);
    }
})