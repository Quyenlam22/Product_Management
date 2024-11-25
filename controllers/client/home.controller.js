const Product = require("../../models/product.model")

const productsHelper = require("../../helpers/product")

// [GET] /
module.exports.index = async (req, res) => {
    const productsFeatured = await Product.find({
        featured: "1",
        status: "active",
        deleted: false
    }).limit(6)

    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)

    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(6)

    const newProductsNew = productsHelper.priceNewProducts(productsNew)

    res.render('client/page/home/index.pug', { 
        pageTitle: 'Trang chủ',
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    })
}