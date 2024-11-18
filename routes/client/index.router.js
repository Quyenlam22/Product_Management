const productRoutes = require("./product.route")
const homeRoutes = require("./home.route")

const categoryMiddleware = require("../../middlewares/client/category.middleware")

module.exports = (app) => {
    // Use Middleware
    app.use(categoryMiddleware.category)

    app.use('/', homeRoutes)
    app.use('/products', productRoutes)
}