const Role = require("../../models/roles.model")

const systemConfig = require("../../config/system")

const paginationHelper = require("../../helpers/pagination")

//[GET] admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    //Pagination
    const countRoles = await Role.countDocuments(find)

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 5
    }, req.query, countRoles)

    const records = await Role.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)

    res.render("admin/page/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records,
        pagination: objectPagination,
    })
}

//[GET] admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/page/roles/create", {
        pageTitle: "Thêm nhóm quyền",
    })
}

//[POST] admin/roles/create
module.exports.createPost = async (req, res) => {
    if (res.locals.role.permissions.includes("roles_create")) {
        try {
            const record = new Role(req.body)
            await record.save()
            req.flash("success", "Thêm mới nhóm quyền thành công!")
        } catch (error) {
            req.flash("error", "Thêm mới nhóm quyền thất bại!")
        }

        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    } else {
        return
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

        const record = await Role.findOne(find)

        res.render("admin/page/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record
        })
    } catch (error) {
        req.flash("error", "Không tìm thấy nhóm quyền!")
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

//[PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    if (res.locals.role.permissions.includes("roles_edit")) {
        try {
            await Role.updateOne({
                _id: req.params.id
            }, req.body)

            req.flash("success", "Cập nhật nhóm quyền thành công!")
        } catch (error) {
            req.flash("error", "Cập nhật nhóm quyền thất bại!")
        }

        res.redirect(`back`)
    } else
        return
}

//[GET] admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find)

    res.render("admin/page/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    })
}

//[PATCH] admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    if (res.locals.role.permissions.includes("roles_permissions")) {
        try {
            const permissions = JSON.parse(req.body.permissions)

            for (const element of permissions) {
                await Role.updateOne({
                    _id: element.id
                }, {
                    permissions: element.permissions
                })
            }

            req.flash("success", "Cập nhật phân quyền thành công!")
        } catch (error) {
            req.flash("error", "Cập nhật phân quyền thất bại!")
        }

        res.redirect(`back`)
    } else
        return
}