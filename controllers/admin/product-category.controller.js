const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const productCategories = await ProductCategory.find(find)

    res.render('admin/page/product-category/index.pug', { 
        pageTitle: 'Danh mục sản phẩm',
        productCategories: productCategories
    })
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)

    res.render('admin/page/product-category/create.pug', { 
        pageTitle: 'Thêm mới danh mục',
        records: records
    })
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
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
}