const express = require('express');

//Code hidden after up to GitHub
require("dotenv").config();

const app = express();
const port = process.env.PORT;

const route = require("./routes/client/index.router")

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/Product_Management');

// const Product = mongoose.model('Product', {
//     title: String,
//     price: Number,
//     thumbnail: String
// });

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static("public"));

route(app)

app.listen(port, () => {
    console.log(`Example listening on port ${port}`)
})