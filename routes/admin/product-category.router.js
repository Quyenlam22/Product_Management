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

route.get('/edit/:id', controller.edit)

route.patch('/edit/:id', upload.single('thumbnail'), uploadCloud.upload, validate.createPost, controller.editPatch)

route.patch("/change-status/:status/:id", controller.changeStatus)

route.get("/detail/:id", controller.detail)

route.patch("/delete/:id", controller.delete)

route.patch("/change-multi", controller.changeMulti)

module.exports = route