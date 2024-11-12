const Product = require("../../models/product.model")

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"})


    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(2)
        return item
    })
    req.flash("success", "Không tìm thấy sản phẩm!")


    res.render(`client/page/products/index`, {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    })
}

// [GET] /products/:slug
// [GET] /products/:id
module.exports.detail = async (req, res) => {
    try{
        let find = {
            deleted: false,
            // slug: req.params.slug,
            _id: req.params.id,
            status: "active"
        }
    
        const product = await Product.findOne(find)
    
        res.render(`client/page/products/detail`, {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        })
    }catch(error){
        req.flash("error", "Không tìm thấy sản phẩm!")
        res.redirect(`/products`)
    }
}

// [GET] products/detail
module.exports.detail = async (req, res) => {
    try {
        let find = {
            _id: req.params.id,
            deleted: false
        }
        const product = await Product.findOne(find)
    
        res.render("client/page/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        })
    } catch (error) {
        req.flash("error", "Không tìm thấy sản phẩm!")
        res.redirect("/products")
    }
}