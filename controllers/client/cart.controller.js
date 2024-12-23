const Cart = require("../../models/cart.model")

const cartHelper = require("../../helpers/cart")

// [GET] /cart
module.exports.index = async (req, res) => {
    try {
        const cartId = req.cookies.cartId

        const cart = await Cart.findOne({
            _id: cartId
        })

        const cartDetail = await cartHelper(cart)
        
        res.render('client/page/cart/index.pug', { 
            pageTitle: 'Giỏ hàng',
            cartDetail: cartDetail
        })
    } catch (error) {
        req.flash("error", "Có lỗi trong quá trình hiển thị sản phẩm!")
        res.redirect(`/cart`)
    }
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    try {
        const productId = req.params.productId
        const quantity = parseInt(req.body.quantity)
        const cartId = req.cookies.cartId

        const cart = await Cart.findOne({
            _id: cartId
        })

        const existProductInCart = cart.products.find(item => item.product_id == productId)

        if(existProductInCart){
            const quantityNew = quantity + existProductInCart.quantity
            
            await Cart.updateOne({
                _id: cartId,
                'products.product_id': productId
            }, {
                '$set': {
                'products.$.quantity': quantityNew
                }
            })
        } else{
            const objectCart = {
                product_id: productId,
                quantity: quantity
            }

            await Cart.updateOne({ _id: cartId }, {
                $push: { products: objectCart }
            })
        }

        req.flash("success", "Thêm sản phẩm thành công!")
        res.redirect('back')
    }catch(error){
        req.flash("error", "Có lỗi trong quá trình thêm sản phẩm!")
        res.redirect(`/cart`)
    }
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    try {
        const cartId = req.cookies.cartId
        const productId = req.params.productId
        
        await Cart.updateOne({_id: cartId}, {
            "$pull": {"products": {"product_id": productId}}
        })

        req.flash("success", "Xóa sản phẩm thành công!")
        res.redirect("back")
    } catch (error) {
        req.flash("error", "Có lỗi trong quá trình Xóa sản phẩm!")
        res.redirect(`/cart`)
    }

}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    try {
        const cartId = req.cookies.cartId
        const productId = req.params.productId
        const quantity = req.params.quantity
        
        await Cart.updateOne({
            _id: cartId,
            'products.product_id': productId
        }, {
            '$set': {
            'products.$.quantity': quantity
            }
        })

        req.flash("success", "Cập nhật sản phẩm thành công!")
        res.redirect("back")
    } catch (error) {
        req.flash("error", "Có lỗi trong quá trình Cập nhật sản phẩm!")
        res.redirect(`/cart`)
    }

}