const express = require('express');
const authControllers = require('../controllers/auth');

const routes = express.Router();

routes.post('/signUp', authControllers.signUp);
routes.post('/signIn', authControllers.signIn);

module.exports = routes;