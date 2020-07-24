const User = require('../models/user');
const Response = require('../util/response');
const error = require('../util/error');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const api_key = 'your Api Key';
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
                    to: req.body.Email,
                    from: 'abhikryadav85@gmail.com',
                    subject: 'Welcome to ABHISHOP',
                    text: 'Account Created!!!',
                    html: `<img src="http://abhi-shop-website.s3-website.us-east-2.amazonaws.com/assets/images/avtar.png" 
                    width="100" height="80">
                    <h4>Welcome to ABHISHOP,</h4>
                    <p>Thank you for creating a ABHISHOP account.</p>
                    <a href="http://abhi-shop-website.s3-website.us-east-2.amazonaws.com/signIn">Click here</a> <span>to Login</span>
                    <p>Thank you for joining ABHISHOP.</p>
                    <p>Sincerely,</p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <h4>The ABHISHOP Team</h>`
                };
                sgMail.send(msg).then((mail) => {
                    return res.status(200).json(
                        Response.Response('Account Created SuccessFully!', 'Account Created SuccessFully!', 1, "signUp_Success", insertedData)
                    )
                }, error => {
                    console.error(error);
                    if (error.response) {
                        console.error(error.response.body)

                    }
                });
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
                error.Error('Invalid Password Address!', 'Invalid Password Address!', 0, "signIn_Fail"
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

exports.forgotPassword = ((req, res, next) => {
    User.findOne({ Email: req.body.Email }).then(user => {
        if (!user) {
            return res.status(203).json(
                error.Error('Account not found with this email!', 'Account not found with this email!', 0, "forgotPassword_Fail")
            )
        }
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err);
                return res.status(203).json(
                    error.Error('Account not found with this email!', 'Account not found with this email!', 0, "forgotPassword_Fail")
                )
            }
            const token = buffer.toString('hex');
            user.resetToken = token;
            user.resetTokenExpriesIn = Date.now() + 3600000;
            user.save().then(result => {
                const msg = {
                    to: req.body.Email,
                    from: 'abhikryadav85@gmail.com',
                    subject: 'Password Reset!',
                    text: 'Password Reset!!!',
                    html: `
                    <h4>Dear Customer,</h4>
                    <p>A request to reset the password for your account has been made at <b>ABHISHOP.</b></p>
                    <p>You may now log in by clicking on this link or copying and pasting it in your browser:</p>
                    <p><a href="http://abhi-shop-website.s3-website.us-east-2.amazonaws.com/resetPassword/${token}">http://localhost:4200/resetPassword/${token}</a></p>
                    <p>This is a one-time reset, so it can be used only once. It expires after 1 hour and nothing will happen if it's not used.</p>
                    <p>Once click on this link, you will be redirected to password reset page so that you can change your password.</p>
                    
                    
                    -- <h5>ABHISHOP team</h5>
                    <img src="http://abhi-shop-website.s3-website.us-east-2.amazonaws.com/assets/images/avtar.png" 
                    width="100" height="80">`
                };
                sgMail.send(msg).then((mail) => {
                    return res.status(200).json(
                        Response.Response('Password Recover link sent to your Email!', 'Password Recover link sent to your Email!', 1, "forgotPassword_Success", user)
                    )
                }, error => {
                    console.error(error);
                    if (error.response) {
                        console.error(error.response.body)

                    }
                });

            })
        })

    }).catch(err => {
        const error = new Error(err);
        error.statusCode = 402;
        return next(err);
    })
});

exports.resetPassword = (req, res, next) => {
    const token = req.body.token;
    User.findOne({ resetToken: token, resetTokenExpriesIn: { $gt: Date.now() } })
        .then(user => {
            if (user) {
                return res.status(200).json(Response.Response('Token is Valid!',
                    'Password Recover link sent to your Email!', 1,
                    "forgotPassword_Success", { userId: user._id.toString(), resetToken: token }))
            } else {
                console.log(user)
                return res.status(203).json(
                    error.Error('Invalid Token!', 'Invalid Token!', 0, "forgotPassword_Fail"
                    ))
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.setNewPassword = (req, res, next) => {
    const newPassword = req.body.NewPassword;
    const userId = req.body.UserId;
    const passwordToken = req.body.PasswordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpriesIn: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 10);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpriesIn = undefined;
            return User.updateOne({
                resetToken: passwordToken,
                resetTokenExpriesIn: { $gt: Date.now() },
                _id: userId
            }, { Password: hashedPassword, resetToken: undefined, resetTokenExpriesIn: undefined })
        })
        .then(result => {
            res.status(202).json(Response.Response('Password reset successfully!',
                'Password reset successfully!', 1,
                "setNewPassword_Success", result))
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
