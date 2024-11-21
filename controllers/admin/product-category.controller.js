const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const createTreeHelper = require("../../helpers/createTree")

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    // Filter Status
    const filterStatus = filterStatusHelper(req.query)

    if (req.query.status)
        find.status = req.query.status

    //Search
    const objectSearch = searchHelper(req.query)

    if (objectSearch.keyword)
        find.title = objectSearch.regex

    //Pagination
    const countProductCategories = await ProductCategory.countDocuments(find)

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 5
    }, req.query, countProductCategories)

    // const records = await ProductCategory.find(find)
    //     .limit(objectPagination.limitItems)
    //     .skip(objectPagination.skip)

    // const newRecords = createTreeHelper.createTree(records)

    // console.log(newRecords)

    //Note*
    const newRecords = await ProductCategory.find(find)
        .sort({
            position: "asc"
        })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)

    res.render('admin/page/product-category/index.pug', {
        pageTitle: 'Danh mục sản phẩm',
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.createTree(records)

    res.render('admin/page/product-category/create.pug', {
        pageTitle: 'Thêm mới danh mục',
        records: newRecords
    })
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
    if (res.locals.role.permissions.includes("product-category_create")) {
        if (req.body.position == "") {
            const count = await ProductCategory.countDocuments()
            req.body.position = count + 1
        } else {
            req.body.position = parseInt(req.body.position)
        }

        try {
            const productCategory = new ProductCategory(req.body)
            await productCategory.save()

            req.flash("success", `Thêm danh mục thành công!`)
        } catch (error) {
            req.flash("error", `Thêm danh mục thất bại!`)
        }

        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    } else {
        return
    }
}

// [GET] /admin/product-category/edit
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id

        let find = {
            _id: id,
            deleted: false
        }

        const record = await ProductCategory.findOne(find)

        const records = await ProductCategory.find({
            deleted: false
        })
        const newRecords = createTreeHelper.createTree(records)

        res.render('admin/page/product-category/edit.pug', {
            pageTitle: 'Chỉnh sửa danh mục',
            record: record,
            records: newRecords
        })
    } catch (error) {
        req.flash("error", "Không tìm thấy danh mục!")
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    }
}

// [POST] /admin/product-category/create
module.exports.editPatch = async (req, res) => {
    if (res.locals.role.permissions.includes("product-category_edit")) {
        const id = req.params.id

        req.body.position = parseInt(req.body.position)

        try {
            await ProductCategory.updateOne({
                _id: id
            }, req.body)

            req.flash("success", `Sửa danh mục thành công!`)
        } catch (error) {
            req.flash("error", `Sửa danh mục thất bại!`)
        }

        res.redirect(`back`)
    } else {
        return
    }
}

// [PATCH] /admin/product-cateqory/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    if (res.locals.role.permissions.includes("product-category_edit")) {
        try {
            await ProductCategory.updateOne({
                _id: req.params.id
            }, {
                status: req.params.status
            })
            req.flash("success", "Chỉnh sửa danh mục thành công !")
        } catch (error) {
            req.flash("error", "Chỉnh sửa danh mục thất bại !")
        }
        res.redirect(`back`)
    } else {
        return
    }
}

// [GET] /admin/products-cateqory/detail/:id
module.exports.detail = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    }

    const record = await ProductCategory.findOne(find)


    if (record.parent_id) {
        var parent = await ProductCategory.findOne({
            _id: record.parent_id,
            deleted: false
        })
    }

    res.render("admin/page/product-category/detail", {
        pageTitle: 'Chi tiết danh mục',
        record: record,
        parent: parent
    })
}

// [DELETE] /admin/products-cateqory/delete-item/:id
module.exports.delete = async (req, res) => {
    if (res.locals.role.permissions.includes("product-category_delete")) {
        try {
            await ProductCategory.updateOne({
                _id: req.params.id
            }, {
                deleted: true
            })
            req.flash("success", "Xóa danh mục thành công !")
        } catch (error) {
            req.flash("error", "Xóa danh mục thất bại !")
        }

        res.redirect(`back`)
    } else {
        return
    }
}

// [PATCH] /admin/products-cateqory/change-multi
module.exports.changeMulti = async (req, res) => {
    if (res.locals.role.permissions.includes("product-category_delete")) {
        const type = req.body.type
        const ids = req.body.ids.split(", ")

        switch (type) {
            case "active":
                try {
                    await ProductCategory.updateMany({
                        _id: {
                            $in: ids
                        }
                    }, {
                        status: "active"
                    })
                    req.flash("success", `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công!`)
                } catch (error) {
                    req.flash("error", `Cập nhật trạng thái cho ${ids.length} sản phẩm thất bại!`)
                }
                break
            case "inactive":
                try {
                    await ProductCategory.updateMany({
                        _id: {
                            $in: ids
                        }
                    }, {
                        status: "inactive"
                    })
                    req.flash("success", `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công!`)
                } catch (error) {
                    req.flash("error", `Cập nhật trạng thái cho ${ids.length} sản phẩm thất bại!`)
                }
                break
            case "delete-all":
                try {
                    await ProductCategory.updateMany({
                        _id: {
                            $in: ids
                        }
                    }, {
                        deleted: true
                    })
                    req.flash("success", `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công!`)
                } catch (error) {
                    req.flash("error", `Cập nhật trạng thái cho ${ids.length} sản phẩm thất bại!`)
                }
                break
            case "change-position":
                try {
                    for (const element of ids) {
                        let [id, position] = element.split("-")
                        position = parseInt(position)
                        await ProductCategory.updateOne({
                            _id: id
                        }, {
                            position: position
                        })
                    }
                    req.flash("success", `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công!`)
                } catch (error) {
                    req.flash("error", `Cập nhật trạng thái cho ${ids.length} sản phẩm thất bại!`)
                }
                default:
                    break;
        }

        res.redirect(`back`)
    } else {
        return
    }
}