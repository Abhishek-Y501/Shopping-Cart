const jwt = require('jsonwebtoken');

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
        next();
    } catch (err) {
        console.log('Invalid Token!');
        const error = new Error('Invalid Token')
        error.statusCode = 404;
        next(error);
    }
})