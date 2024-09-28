const dashboardRoutes = require("./dashboard.router")
const productsRoutes = require("./product.router")
const systemConfig = require("../../config/system")


module.exports = (app) => {
    app.use(systemConfig.prefixAdmin + '/dashboard', dashboardRoutes)
    app.use(systemConfig.prefixAdmin + '/products', productsRoutes)
}