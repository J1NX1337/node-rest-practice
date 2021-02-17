const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    // expecting name and price in the request body:
    // these requirements should be detailed in documentation if this api ever were to be public
    var product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    // saves created product in MongoDB database, logs result and catches any errors
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Product added to database.',
            createdProduct: product
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:productId', (req, res, next) => {
    var id = req.params.productId;
    Product.findById(id).exec().then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: "Product not found."});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:productId', (req, res, next) => {
    var id = req.params.productId;
    var updateOps = {};
    // takes a kvp array as the body content for changing property values
    // e.g. [{"propName": "name", "value": "name of product"}]
    for (var ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, 
                   { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:productId', (req, res, next) => {
    var id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;