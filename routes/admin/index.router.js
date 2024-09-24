const dashboardRoutes = require("./dashboard.router")
const systemConfig = require("../../config/system")


module.exports = (app) => {
    app.use(systemConfig.prefixAdmin + '/dashboard', dashboardRoutes)
}