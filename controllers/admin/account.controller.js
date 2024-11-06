const Account = require("../../models/account.model")
const Role = require("../../models/roles.model")

const md5 = require("md5")

const systemConfig = require("../../config/system")

//[GET] admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Account.find(find).select("-password -token")
    
    for(const record of records){
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }

    res.render("admin/page/account/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    })
}

//[PATCH] admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
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
    try {
        const emailExist = await Account.findOne({
            email: req.body.email,
            deleted: false
        })

        if (emailExist) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`)
            res.redirect("back")
        }
        else{
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
    
        const roles = await Role.find({deleted: false})

        res.render("admin/page/account/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            record: record,
            roles: roles
        })
    } catch (error) {
        req.flash("error", "Không tìm thấy tài khoản!")
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

//[PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => { 
    try {
        const emailExist = await Account.findOne({
            _id: {$ne: req.params.id},
            email: req.body.email,
            deleted: false
        })

        if (emailExist) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`)
        }

        if(req.body.password){
            req.body.password = md5(req.body.password)
        }
        else{
            delete req.body.password
        }

        await Account.updateOne({_id: req.params.id}, req.body)

        req.flash("success", "Cập nhật tài khoản thành công!")
    } catch (error) {
        req.flash("error", "Cập nhật tài khoản thất bại!")
    }

    res.redirect(`back`)
}

// //[GET] admin/roles/permissions
// module.exports.permissions = async (req, res) => { 
//     let find = {
//         deleted: false
//     }

//     const records = await Role.find(find)

//     res.render("admin/page/roles/permissions", {
//         pageTitle: "Phân quyền",
//         records: records
//     })
// }

// //[PATCH] admin/roles/permissions
// module.exports.permissionsPatch = async (req, res) => { 
//     try {
//         const permissions = JSON.parse(req.body.permissions)

//         for (const element of permissions) {
//             await Role.updateOne({_id: element.id}, {permissions: element.permissions})
//         }

//         req.flash("success", "Cập nhật phân quyền thành công!")
//     } catch (error) {
//         req.flash("error", "Cập nhật phân quyền thất bại!")
//     }

//     res.redirect(`back`)
// }