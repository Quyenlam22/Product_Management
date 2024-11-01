const dashboardRoutes = require("./dashboard.router")
const productsRoutes = require("./product.router")
const productCategoryRoutes = require("./product-category.router")
const roleRoutes = require("./roles.router")
const systemConfig = require("../../config/system")


module.exports = (app) => {
    app.use(systemConfig.prefixAdmin + '/dashboard', dashboardRoutes)
    app.use(systemConfig.prefixAdmin + '/product-category', productCategoryRoutes)
    app.use(systemConfig.prefixAdmin + '/products', productsRoutes)
    app.use(systemConfig.prefixAdmin + '/roles', roleRoutes)
}