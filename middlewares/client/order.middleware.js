const Order = require("../../models/order.model")
const User = require("../../models/user.model")

module.exports.listOrder = async (req, res, next) => {
    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser
    })
    if (user) {
        const orders = await Order.find({
            user_id: user.id,
            deleted: false
        })

        if(orders){
            res.locals.orders = orders
        }
    }
    next()
}

module.exports.tokenOrder = async (req, res, next) => {
    if (!req.cookies.order && !req.cookies.tokenUser) {
        req.flash("error", "Vui lòng đăng nhập để có thể truy cập!")
        res.redirect("/auth/login")
    }
    else{
        next()
    }
}