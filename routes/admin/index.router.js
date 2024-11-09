const dashboardRoutes = require("./dashboard.router")
const productsRoutes = require("./product.router")
const productCategoryRoutes = require("./product-category.router")
const roleRoutes = require("./roles.router")
const accountRoutes = require("./account.router")
const authRoutes = require("./auth.router")
const systemConfig = require("../../config/system")

const authMiddleware = require("../../middlewares/admin/auth.middleware")

module.exports = (app) => {
    app.get(systemConfig.prefixAdmin + '/', (req, res) => {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    })
    
    app.use(systemConfig.prefixAdmin + '/dashboard', authMiddleware.requireAuth, dashboardRoutes)
    app.use(systemConfig.prefixAdmin + '/product-category', authMiddleware.requireAuth, productCategoryRoutes)
    app.use(systemConfig.prefixAdmin + '/products', authMiddleware.requireAuth, productsRoutes)
    app.use(systemConfig.prefixAdmin + '/roles', authMiddleware.requireAuth, roleRoutes)
    app.use(systemConfig.prefixAdmin + '/accounts', authMiddleware.requireAuth, accountRoutes)
    app.use(systemConfig.prefixAdmin + '/auth', authRoutes)
}