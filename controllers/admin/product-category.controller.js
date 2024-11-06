const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")

const createTreeHelper = require("../../helpers/createTree")

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.createTree(records)

    res.render('admin/page/product-category/index.pug', { 
        pageTitle: 'Danh mục sản phẩm',
        records: newRecords
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

// [GET] /admin/product-category/edit
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
    
        let find = {
            _id: id,
            deleted: false
        }
    
        const record = await ProductCategory.findOne(find)
    
        const records = await ProductCategory.find({deleted: false})
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
    const id = req.params.id
 
    req.body.position = parseInt(req.body.position)

    try {
        await ProductCategory.updateOne( {_id : id}, req.body)

        req.flash("success", `Sửa danh mục thành công!`)
    } catch (error) {
        req.flash("error", `Sửa danh mục thất bại!`)
    }

    res.redirect(`back`)
}