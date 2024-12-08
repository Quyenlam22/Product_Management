const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const Order = require("../../models/order.model")

const cartHelper = require("../../helpers/cart")

// [GET] /checkout
module.exports.index = async (req, res) => {
    try {
        const cartId = req.cookies.cartId

        const cart = await Cart.findOne({
            _id: cartId
        })

        const cartDetail = await cartHelper(cart)

        res.render('client/page/checkout/index.pug', { 
            pageTitle: 'Đặt hàng',
            cartDetail: cartDetail
        })
    } catch (error) {
        req.flash("error", "Có lỗi trong quá trình hiển thị sản phẩm!")
        res.redirect(`/cart`)
    }
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    try {
        const cartId = req.cookies.cartId

        const userInfo = req.body

        const cart = await Cart.findOne({
            _id: cartId
        })

        const products = []

        for (const product of cart.products) {
            const objectProduct = {
                product_id: product.product_id,
                price: 0,
                discountPercentage: 0,
                quantity: product.quantity
            }

            const productInfo = await Product.findOne({
                _id: product.product_id
            }).select("price discountPercentage")

            objectProduct.price = productInfo.price
            objectProduct.discountPercentage = productInfo.discountPercentage

            products.push(objectProduct)
        }

        const orderInfo = {
            cart_id: cartId,
            userInfor: userInfo,
            products: products
        }

        const order = new Order(orderInfo)
        await order.save()

        await Cart,Order.updateOne({
            _id: cartId
        }, {
            products: []
        })
        
        res.redirect(`/checkout/success/${order.id}`)
    } catch (error) {
        req.flash("error", "Có lỗi trong quá trình hiển thị!")
        res.redirect(`/cart`)
    }
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {

    res.render('client/page/checkout/success', { 
        pageTitle: 'Đặt hàng thành công',
    })
}