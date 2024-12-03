const Cart = require("../../models/cart.model")
const cartCategory = require("../../models/cart.model")

module.exports.cartId = async (req, res, next) => {
    if(!req.cookies.cartId){
        const cart = new Cart()
        await cart.save()

        console.log(cart);
        res.cookie("cartId", cart.id, { 
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        })
    }
    else{
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        })
        
        cart.totalQuantity = cart.products.reduce((sum, item) => (sum+item.quantity), 0)
        
        res.locals.miniCart = cart
    }

    next()
}