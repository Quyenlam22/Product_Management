const Product = require("../models/product.model")

const productHelper = require("./product")

module.exports = async (cart) => {
        if(cart.products.length > 0){
            for(const item of cart.products){
                const productId = item.product_id
                const productInfo = await Product.findOne({
                    _id: productId,
                }).select("title thumbnail slug price discountPercentage")
                
                productInfo.priceNew = productHelper.priceNewProduct(productInfo)

                item.productInfo = productInfo

                item.totalPrice = productInfo.priceNew * item.quantity 
            }
        }

        cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)
        
        return cart
}