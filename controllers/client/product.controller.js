module.exports.index =  (req, res) => {
    res.render(`client/page/products/index`, {
        titlePage: "Danh sách sản phẩm",
        message: "Trang danh sách sản phẩm",
        // products: products
    })
}