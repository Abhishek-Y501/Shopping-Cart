const Product = require('../models/product');
const Response = require('../util/response').Response;
const mongoose = require('mongoose');
const fs = require('fs');

exports.products = ((req, res, next) => {
    Product.find().then(products => {
        res.status(201).json(Response('Success', 'Data retrived successfully!', 1, 'product_success', products));
    }).catch(err => {
        err.statusCode = 500;
        next(err);
    })
});

exports.addProduct = ((req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const product = {
        Name: req.body.Name,
        Description: req.body.Description,
        ImageUrl: url + "/images/" + req.file.filename,
        Price: req.body.Price,
        UserId: req.user.userId
    }
    Product.create(product).then(insertedData => {
        res.status(201).json(Response('Success', 'Data inserted successfully!', 1, 'productAdd_success', insertedData));
    }).catch(err => {
        err.statusCode = 500;
        next(err);
    })
})

exports.deleteProduct = ((req, res, next) => {
    const productId = req.params.id;
    Product.findById(productId).then(product => {
        console.log(product.ImageUrl.split('images/')[1]);
        fs.unlink('backend/images/' + product.ImageUrl.split('images/')[1], (err) => { if (err) console.log(err) });
        return Product.deleteOne({ _id: productId })
    }).then(result => {
        res.status(200).json(Response('Success', 'Data deleted successfully!', 1, 'productDelete_success', result))
    }).catch(err => {
        err.statusCode = 500;
        next(err);
    })
})

exports.updateProduct = ((req, res, next) => {
    const productId = req.body.UserId;
    console.log(req.body)
    const url = req.protocol + "://" + req.get("host");
    const imagePath = req.body.ImageUrl;
    if (req.file) {
        imagePath = url + "/images/" + req.file.filename;
    }
    Product.updateOne({ _id: productId, UserId: req.user.userId }, {
        $set: {
            Name: req.body.Name,
            Description: req.body.Description,
            ImageUrl: imagePath,
            Price: req.body.Price
        }
    }).then(updatedData => {
        res.status(201).json(Response('Success', 'Data updated successfully!', 1, 'productUpdated_success', updatedData));
    }).catch(err => {
        err.statusCode = 500;
        next(err);
    })
})