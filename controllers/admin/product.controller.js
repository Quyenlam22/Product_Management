const Product = require("../../models/product.model")
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

    if(req.query.status)
        find.status = req.query.status
    
    //SEARCH
    const objectSearch = searchHelper(req.query)
    // console.log(objectSearch)

    if(objectSearch.keyword){
        find.title = objectSearch.regex
    }

    // PAGINATION
    const countProducts = await Product.countDocuments(find)

    let objectPagination = paginationHelper(
        {
        currentPage: 1,
        limitItems: 5
        },
        req.query, 
        countProducts
    )
    
    


    const products = await Product.find(find)
                    .sort({position: "desc"})
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

    await Product.updateOne({_id: id}, {status: status})

    req.flash("success", "Cập nhật trạng thái thành công!")

    res.redirect("back")
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(", ")
    
    switch(type){
        case "active":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "active" }
             )
            req.flash("success", `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công!`)
            break;
        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "inactive" }
             )
             req.flash("success", `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công!`)
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                {   
                    deleted: true,
                    deletedAt: new Date()
                }
             )
             req.flash("success", `Xóa ${ids.length} sản phẩm thành công!`)
            break;
        case "change-position":
            for (const element of ids) {
                let [id, position] = element.split("-")
                position = parseInt(position)
                await Product.updateOne({ _id: id}, {
                    position: position
                })
            }
            req.flash("success", `Thay đổi vị trí ${ids.length} sản phẩm thành công!`)
            break;
        default:
            break;
    }

    res.redirect("back")
}

// [DELETE] /admin/products/delete:id
module.exports.deletedItem = async (req, res) => {
    const id = req.params.id

    await Product.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()
    })

    req.flash("success", `Xóa sả phẩm thành công!`)

    res.redirect("back")
}