const express = require("express")
const route = express.Router()

//Upload Images
const multer = require('multer')
const upload = multer()

const controller = require("../../controllers/admin/account.controller")
const validate = require("../../validates/admin/account.validate")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

route.get("/", controller.index)

route.patch("/change-status/:status/:id", controller.changeStatus)

route.get("/create", controller.create)

route.post("/create", upload.single('avatar'), uploadCloud.upload, validate.createPost, controller.createPost)

route.get("/edit/:id", controller.edit)

route.patch("/edit/:id", upload.single('avatar'), uploadCloud.upload, validate.editPatch, controller.editPatch)

module.exports = route