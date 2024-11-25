const express = require("express")
const route = express.Router()

const controller = require("../../controllers/client/product.controller")

route.get('/', controller.index)

route.get('/detail/:id', controller.detail)

route.get('/:slugCategory', controller.category)

module.exports = route