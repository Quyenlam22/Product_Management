module.exports.createPost = (req, res, next) => {
    if(!req.body.fullName){
        req.flash("error", "Vui lòng nhập lại họ tên!")
        res.redirect("back")
        return
    }
    if(!req.body.email){
        req.flash("error", "Vui lòng nhập lại email!")
        res.redirect("back")
        return
    }
    if(!req.body.password){
        req.flash("error", "Vui lòng nhập lại mật khẩu!")
        res.redirect("back")
        return
    }
    next()
}

module.exports.editPatch = (req, res, next) => {
    if(!req.body.fullName){
        req.flash("error", "Vui lòng nhập lại họ tên!")
        res.redirect("back")
        return
    }
    if(!req.body.email){
        req.flash("error", "Vui lòng nhập lại email!")
        res.redirect("back")
        return
    }
    next()
}