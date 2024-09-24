const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    })

    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(2)
        return item
    })

    res.render(`client/page/products/index`, {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    })
}