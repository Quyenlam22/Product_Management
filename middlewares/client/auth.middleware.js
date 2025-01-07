const User = require("../../models/user.model")

//Check Login
module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.tokenUser){
        req.flash("error", "Vui lòng đăng nhập để thanh toán!")
        res.redirect(`/auth/login`)
    }
    else{
        if(req.cookies.tokenUser){
            const user = await User.findOne({
                tokenUser: req.cookies.tokenUser
            }).select("-password")
            if(!user){
                req.flash("error", "Không tìm thấy tài khoản!")
                res.redirect(`/`)
            }
            else{
                next()
            }
        }
    }
}

module.exports.checkUser = async (req, res, next) => {
    if(req.cookies.tokenUser){
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser
        }).select("-password")
        if(user){
            res.locals.userClient = user
        }
    }

    next()
}