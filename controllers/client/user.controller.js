const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const Cart = require("../../models/cart.model")

const md5 = require("md5")

const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendMail")
const userSocket = require("../../sockets/client/user.socket")

//[GET] user/register
module.exports.register = async (req, res) => {
    res.render("client/page/user/register", {
        pageTitle: "Đăng ký tài khoản"
    })
}

//[POST] user/register
module.exports.registerPost = async (req, res) => {
    try {
        const existEmail = await User.findOne({
            email: req.body.email
        })
        if (existEmail) {
            req.flash("Email đã tồn tại!")
            res.redirect("back")
            return;
        }

        req.body.password = md5(req.body.password)
        const user = new User(req.body)
        await user.save()

        res.cookie("tokenUser", user.tokenUser)

        req.flash("Đăng ký tài khoản thành công")
        res.redirect(`/`)
    } catch (error) {
        req.flash("error", "Đăng ký tài khoản thất bại!");
        res.redirect("back")
    }
}

//[GET] user/login
module.exports.login = async (req, res) => {
    res.render("client/page/user/login", {
        pageTitle: "Đăng nhập"
    })
}

//[POST] user/login
module.exports.loginPost = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const user = await User.findOne({
            email: email,
            deleted: false
        })

        if (!user) {
            req.flash("error", "Email không tồn tại!")
            res.redirect("back")
            return
        }

        if (user.password != md5(password)) {
            req.flash("error", "Sai mật khẩu!")
            res.redirect("back")
            return
        }

        if (user.status == "inactive") {
            req.flash("error", "Tài khoản đang bị khóa!")
            res.redirect("back")
            return
        }

        const cart = await Cart.findOne({
            user_id: user.id
        })

        if (!cart) {
            await Cart.updateOne({
                _id: req.cookies.cartId,
            }, {
                user_id: user.id
            })
        } else {
            res.cookie("cartId", cart.id)
        }

        res.cookie("tokenUser", user.tokenUser, {
            maxAge: 12 * 60 * 60 * 1000
        }) //12 Hours

        await User.updateOne({
            tokenUser: user.tokenUser
        }, {
            statusOnline: "online"
        })

        const userAfterUpdate = await User.findOne({
            tokenUser: user.tokenUser,
            deleted: false
        })

        userSocket(res, userAfterUpdate)

        req.flash("success", "Đăng nhập thành công!")
        res.redirect(`/`)
    } catch (e) {
        req.flash("error", "Đăng nhập thất bại!")
        res.redirect("back")
    }
}

//[GET] user/logout
module.exports.logout = async (req, res) => {
    await User.updateOne({
        tokenUser: req.cookies.tokenUser
    }, {
        statusOnline: "offline"
    })

    const userAfterUpdate = await User.findOne({
        _id: res.locals.user.id
    })

    if(userAfterUpdate){
        userSocket(res, userAfterUpdate)
    }

    res.clearCookie("tokenUser")
    res.clearCookie("cartId")
    req.flash("success", "Thoát tài khoản thành công!")
    res.redirect("/")
}

//[GET] user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/page/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu"
    })
}

//[POST] user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            deleted: false
        })
        if (!user) {
            req.flash("error", "Email không tồn tại!")
            res.redirect("back")
            return
        }

        const otp = generateHelper.generateRandomNumber(6)
        const objectForgotPassword = {
            email: req.body.email,
            otp: otp,
            expireAt: Date.now()
        }

        const forgotPassword = new ForgotPassword(objectForgotPassword)
        await forgotPassword.save()

        const subject = "Mã OTP xác minh lấy lại mật khẩu"
        const html = `Mã OTP xác minh của bạn là: <b>${otp}</b>. Thời hạn sử dụng là 3 phút!`
        sendMailHelper.sendMail(req.body.email, subject, html)

        res.redirect(`/user/password/otp?email=${req.body.email}`)
    } catch (e) {
        req.flash("error", "Có lỗi trong quá trình lấy email!")
        res.redirect("back")
    }
}

//[GET] user/password/otp
module.exports.otpPassword = async (req, res) => {
    res.render("client/page/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: req.query.email
    })
}

//[POST] user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    try {
        const email = req.body.email
        const otp = req.body.otp

        const result = await ForgotPassword.findOne({
            email: email,
            otp: otp
        })

        if (!result) {
            req.flash("error", "OTP không hợp lệ!")
            res.redirect(`back`)
            return
        }
        const user = await User.findOne({
            email: email
        })
        res.cookie("tokenUser", user.tokenUser)

        res.redirect('/user/password/reset')
    } catch (e) {
        req.flash("error", "Có lỗi trong quá trình nhập OTP!")
        res.redirect("back")
    }
}

//[GET] user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/page/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu",
    })
}

//[POST] user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    try {
        const password = req.body.password

        await User.updateOne({
            tokenUser: req.cookies.tokenUser
        }, {
            password: md5(password)
        })

        req.flash("success", " Cập nhật mật khẩu thành công!")
        res.redirect('/')
    } catch (e) {
        req.flash("error", "Có lỗi trong quá trình đặt lại mật khẩu!")
        res.redirect("back")
    }
}

//[GET] user/info
module.exports.info = async (req, res) => {
    res.render("client/page/user/info", {
        pageTitle: "Thông tin tài khoản",
    })
}
