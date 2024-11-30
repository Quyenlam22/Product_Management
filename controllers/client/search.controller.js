const Product = require("../../models/product.model")

const productsHelper = require("../../helpers/product")

// [GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword

    let newProducts

    if(keyword){
        const regex = new RegExp(keyword, "i")
        const products = await Product.find({
            title: regex, 
            status: "active",
            deleted: false
        })

        newProducts = productsHelper.priceNewProducts(products)
    }
    
    res.render(`client/page/search/index`, {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    })
}