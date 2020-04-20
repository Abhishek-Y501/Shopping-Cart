const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const Error = require('./util/error');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User=require('./models/user');
const app = express();

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(bodyParser.urlencoded({ extended: true }));

var corsOptions = {
    origin: "http://localhost:8080"
};

app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization,X-HTTP-Method-Override"
//     );
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//     );
//     next();
// });


app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', shopRoutes);

app.use((error, req, res, next) => {
    let statusCode = error.statusCode || 500;
    res.status(statusCode).json(
        Error.Error('Something Went Wrong!', 'Something Went Wrong!', 0, "displayMessage")
    )
})


mongoose.connect("mongodb+srv://abhishek:cGWmXz90wfvFZItP@cluster0-rfd5b.mongodb.net/SHOP_KART").then(result => {
    console.log('DB Connected!!!');
}).catch(err => {
    console.log(err)
})

module.exports = app;