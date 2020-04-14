const User = require('../models/user');
const Response = require('../util/response');
const error = require('../util/error');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');


const api_key = "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";
sgMail.setApiKey(api_key);

exports.signUp = ((req, res, next) => {
    User.findOne({ Email: req.body.Email }).then(user => {
        let insertedData;
        if (user) {
            return res.status(203).json(
                error.Error('Account Already Exists!', 'Account Already Exists!', 0, "signUp_Fail")
            )
        }
        bcrypt.hash(req.body.Password, 10).then(hashPWD => {
            const newUser =
            {
                Name: req.body.Name,
                Email: req.body.Email,
                Password: hashPWD,
                Cart: []
            }
            return User.create(newUser)
        })
            .then(result => {
                insertedData = result;
                const msg = {
                    to: 'abhikrhans@gmail.com',
                    from: 'abhikryadav85@gmail.com',
                    subject: 'Signup succeeded!',
                    text: 'Account Created!!!',
                    html: '<h1>You successfully signed up!</h1><br/> <a href="http://localhost:4200/signIn">Click here</a> <span>to Login</span>'
                };
                sgMail.send(msg);
                res.status(200).json(
                    Response.Response('Account Created SuccessFully!', 'Account Created SuccessFully!', 1, "signUp_Success", insertedData)
                )
            })
            .catch(err => {
                const error = new Error(err);
                error.statusCode = 402;
                return next(err);
            })

    }).catch(err => {
        const error = new Error(err);
        error.statusCode = 402;
        return next(err);
    })

})

exports.signIn = ((req, res, next) => {
    let validUser;
    User.findOne({ Email: req.body.Email }).then(user => {
        if (!user) {
            return res.status(203).json(
                error.Error('Invalid Email Address!', 'Invalid Email Address!', 0, "signIn_Fail"
                ))
        }
        validUser = user
        return bcrypt.compare(req.body.Password, user.Password);
    }).then(passMatch => {
        if (!passMatch) {
            return res.status(203).json(
                error.Error('Invalid Passowrd Address!', 'Invalid Passowrd Address!', 0, "signIn_Fail"
                ))
        }
        const token = jwt.sign({
            email: validUser.Email, userId: validUser._id
        },
            "shopping_kart_secret_key",
            { expiresIn: '1h' });

        res.status(200).json(
            Response.Response('SuccessFully Signed In!', 'SuccessFully Signed In!', 1, "signIn_Success", { token: token, expiresIn: 3600 }
            ))
    })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 402;
            return next(err);
        })
})