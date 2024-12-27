const User = require("../../models/user.model")

//Check Login
module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        req.flash("success", "Hết phiên đăng nhập!")
        res.redirect(`/user/login`)
    } else {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser
        }).select("-password")
        if (!user) {
            res.redirect(`/user/login`)
        } else {
            res.locals.userClient = user
            next()
        }

    }
}