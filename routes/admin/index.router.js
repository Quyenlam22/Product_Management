const dashboardRoutes = require("./dashboard.router")
const productsRoutes = require("./product.router")
const productCategoryRoutes = require("./product-category.router")
const roleRoutes = require("./roles.router")
const accountRoutes = require("./account.router")
const authRoutes = require("./auth.router")
const systemConfig = require("../../config/system")


module.exports = (app) => {
    app.get(systemConfig.prefixAdmin + '/', (req, res) => {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    })
    
    app.use(systemConfig.prefixAdmin + '/dashboard', dashboardRoutes)
    app.use(systemConfig.prefixAdmin + '/product-category', productCategoryRoutes)
    app.use(systemConfig.prefixAdmin + '/products', productsRoutes)
    app.use(systemConfig.prefixAdmin + '/roles', roleRoutes)
    app.use(systemConfig.prefixAdmin + '/accounts', accountRoutes)
    app.use(systemConfig.prefixAdmin + '/auth', authRoutes)
}