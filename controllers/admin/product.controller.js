const Product = require("../../models/product.model")
const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")

// [GET] /admin/products
module.exports.index = async (req, res) => {

    //REFINE
    const filterStatus = filterStatusHelper(req.query)

    // console.log(filterStatus)

    let find = {
        deleted: false
    }

    if (req.query.status)
        find.status = req.query.status

    //SEARCH
    const objectSearch = searchHelper(req.query)

    if (objectSearch.keyword) {
        find.title = objectSearch.regex
    }

    // PAGINATION
    const countProducts = await Product.countDocuments(find)

    let objectPagination = paginationHelper({
            currentPage: 1,
            limitItems: 5
        },
        req.query,
        countProducts
    )

    // Sort
    let sort = {}
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }
    else{
        sort.position = "desc"
    }


    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)

    res.render('admin/page/products/index.pug', {
        pageTitle: 'Danh sách sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id

    try {
        await Product.updateOne({
            _id: id
        }, {
            status: status
        })
        req.flash("success", "Cập nhật trạng thái thành công!")
    } catch (error) {
        req.flash("error", `Cập nhật trạng thái thất bại!`)
    }
    res.redirect("back")
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(", ")

    switch (type) {
        case "active":
            try {
                await Product.updateMany({
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
            break;
        case "inactive":
            try {
                await Product.updateMany({
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
            break;
        case "delete-all":
            try {
                await Product.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    deleted: true,
                    deletedAt: new Date()
                })
                req.flash("success", `Xóa ${ids.length} sản phẩm thành công!`)
            } catch (error) {
                req.flash("error", `Xóa ${ids.length} sản phẩm thất bại!`)
            }
            break;
        case "change-position":
            try {
                for (const element of ids) {
                    let [id, position] = element.split("-")
                    position = parseInt(position)
                    await Product.updateOne({
                        _id: id
                    }, {
                        position: position
                    })
                }
                req.flash("success", `Thay đổi vị trí ${ids.length} sản phẩm thành công!`)
            } catch (error) {
                req.flash("error", `Thay đổi vị trí ${ids.length} sản phẩm thất bại!`)
            }
            break;
        default:
            break;
    }

    res.redirect("back")
}

// [DELETE] /admin/products/delete:id
module.exports.deletedItem = async (req, res) => {
    const id = req.params.id

    try {
        await Product.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        })

        req.flash("success", `Xóa sản phẩm thành công!`)
    } catch (error) {
        req.flash("error", `Xóa sản phẩm thất bại!`)
    }

    res.redirect("back")
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render('admin/page/products/create.pug', {
        pageTitle: 'Thêm mới sản phẩm'
    })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {

    req.body.price = parseFloat(req.body.price)
    req.body.discountPercentage = parseFloat(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments()
        req.body.position = countProducts + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }

    try {
        const product = new Product(req.body)
        await product.save()

        req.flash("success", `Thêm sản phẩm thành công!`)
    } catch (error) {
        req.flash("error", `Thêm sản phẩm thất bại!`)
    }

    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        let find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find)

        res.render('admin/page/products/edit.pug', {
            pageTitle: 'Sửa sản phẩm',
            product: product
        })
    } catch (error) {
        req.flash("error", `Không tìm thấy sản phẩm!`)
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {

    req.body.price = parseFloat(req.body.price)
    req.body.discountPercentage = parseFloat(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    try {
        await Product.updateOne({
            _id: req.params.id
        }, req.body)
        req.flash("success", `Sửa sản phẩm thành công!`)
    } catch (error) {
        req.flash("success", `Sửa sản phẩm thất bại!`)
    }
    res.redirect(`back`)
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        let find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find)

        res.render('admin/page/products/detail.pug', {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        req.flash("error", `Không tìm thấy sản phẩm!`)
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}