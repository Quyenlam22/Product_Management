const express = require("express")
const route = express.Router()

//Upload Images
const multer = require('multer')
const upload = multer()

const controller = require("../../controllers/admin/product-category.controller")
const validate = require("../../validates/admin/product-category.validate")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

route.get('/', controller.index)

route.get('/create', controller.create)

route.post('/create', upload.single('thumbnail'), uploadCloud.upload, validate.createPost, controller.createPost)

module.exports = route