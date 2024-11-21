const Account = require("../../models/account.model")
const Role = require("../../models/roles.model")

const paginationHelper = require("../../helpers/pagination")

const md5 = require("md5")

const systemConfig = require("../../config/system")

//[GET] admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    //Pagination
    const countAccounts = await Account.countDocuments(find)

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 5
    }, req.query, countAccounts)
    const records = await Account.find(find).select("-password -token")

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }

    res.render("admin/page/account/index", {
        pageTitle: "Danh sách tài khoản",
        records: records,
        pagination: objectPagination
    })
}

//[PATCH] admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_edit")) {
        try {
            await Account.updateOne({
                _id: req.params.id,
                status: req.params.status
            })
            req.flash("success", "Chỉnh sửa trạng thái tài khoản thành công!")
        } catch (error) {
            req.flash("error", "Chỉnh sửa trạng thái tài khoản thất bại!")
        }
        res.redirect("back")
    } else return
}

//[GET] admin/roles/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const roles = await Role.find(find)
    res.render("admin/page/account/create", {
        pageTitle: "Thêm tài khoản",
        roles: roles
    })
}

//[POST] admin/account/create
module.exports.createPost = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_create")) {
        try {
            const emailExist = await Account.findOne({
                email: req.body.email,
                deleted: false
            })

            if (req.body.role_id == "") {
                req.flash("error", `Vui lòng chọn phân quyền`)
                res.redirect("back")
                return
            }

            if (emailExist) {
                req.flash("error", `Email ${req.body.email} đã tồn tại`)
                res.redirect("back")
            } else {
                req.body.password = md5(req.body.password)
                const record = new Account(req.body)
                await record.save()
                req.flash("success", "Thêm mới nhóm quyền thành công!")
                res.redirect(`${systemConfig.prefixAdmin}/accounts`)
            }
        } catch (error) {
            req.flash("error", "Thêm mới nhóm quyền thất bại!")
            res.redirect(`${systemConfig.prefixAdmin}/accounts`)
        }
    } else return
}

//[GET] admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id

        let find = {
            _id: id,
            deleted: false
        }

        const record = await Account.findOne(find)

        const roles = await Role.find({
            deleted: false
        })

        res.render("admin/page/account/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            record: record,
            roles: roles
        })
    } catch (error) {
        req.flash("error", "Không tìm thấy tài khoản!")
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

//[PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_edit")) {
        try {
            const emailExist = await Account.findOne({
                _id: {
                    $ne: req.params.id
                },
                email: req.body.email,
                deleted: false
            })

            if (emailExist) {
                req.flash("error", `Email ${req.body.email} đã tồn tại`)
            }

            if (req.body.role_id == "") {
                req.flash("error", `Vui lòng chọn phân quyền`)
                res.redirect("back")
                return
            }

            if (req.body.password) {
                req.body.password = md5(req.body.password)
            } else {
                delete req.body.password
            }

            await Account.updateOne({
                _id: req.params.id
            }, req.body)

            req.flash("success", "Cập nhật tài khoản thành công!")
        } catch (error) {
            req.flash("error", "Cập nhật tài khoản thất bại!")
        }

        res.redirect(`back`)
    } else return
}

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const account = await Account.findOne({
            _id: req.params.id,
            deleted: false
        })

        const role = await Role.findOne({
            _id: account.role_id,
            deleted: false
        })

        res.render("admin/page/account/detail", {
            pageTitle: "Chi tiết tài khoản",
            account: account,
            role: role
        })
    } catch (error) {
        req.flash("error", "Không tìm thấy tài khoản!")
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

//[PATCH] admin/accounts/change-status/:id/:status
module.exports.changeStatus = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_edit")) {
        try {
            await Account.updateOne({
                _id: req.params.id
            }, {
                status: req.params.status
            })
            req.flash("success", "Cập nhật trạng thái tài khoản thành công!")
        } catch (error) {
            req.flash("error", "Cập nhật trạng thái tài khoản thất bại!")
        }

        res.redirect(`back`)
    } else return
}

// [PATCH] /admin/delete-item/:id
module.exports.delete = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_delete")) {
        try {
            await Account.updateOne({
                _id: req.params.id
            }, {
                deleted: true
            })
            req.flash("success", "Xóa tài khoản thành công !")
        } catch (error) {
            req.flash("error", "Xóa tài khoản thất bại !")
        }
        res.redirect(`back`)
    } else return
}