const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
//const orderRoutes = require('./api/routes/orders');

// connecting this API to our MongoDB database
const uri = "mongodb+srv://Hijinx:" +
            process.env.MONGO_ATLAS_PW +
            "@node-rest-practice.jgubs.mongodb.net/node-rest-practice?retryWrites=true&w=majority";
const args = {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true 
};
mongoose.connect(uri, args).then(res => {
    console.log("DB Connected!")
}).catch(err => {
    console.log(Error, err.message);
});

// using morgan to log requests and time taken to handle them
app.use(morgan('dev'));
// parse simple request bodies to more human-readable form
app.use(bodyParser.urlencoded({extended: false}));
// extract json data and make it easily readable
app.use(bodyParser.json());

// preventing browser cors errors by allowing headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    // supported request methods
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();  // allowing the next route handlers to handle the request
});

// routes that handle requests
app.use('/products', productRoutes);
//app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    var error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;