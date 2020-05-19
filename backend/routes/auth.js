const express = require('express');
const authControllers = require('../controllers/auth');

const routes = express.Router();

routes.post('/signUp', authControllers.signUp);
routes.post('/signIn', authControllers.signIn);
routes.post('/forgotPassword', authControllers.forgotPassword);
routes.post('/resetPassword', authControllers.resetPassword);
routes.post('/setNewPassword', authControllers.setNewPassword);

module.exports = routes;