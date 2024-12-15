const User = require("../../models/user.model")

const md5 = require("md5")

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

        res.cookie("tokenUser", user.tokenUser, {
            maxAge: 12 * 60 * 60 * 1000
        }) //12 Hours
        req.flash("success", "Đăng nhập thành công!")
        res.redirect(`/`)
    }catch(e){
        req.flash("error", "Đăng nhập thất bại!")
        res.redirect("back")
    }
}

//[GET] user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
    req.flash("success", "Thoát tài khoản thành công!")
    res.redirect("/")
}

