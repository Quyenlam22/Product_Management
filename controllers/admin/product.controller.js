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