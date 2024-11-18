const express = require("express")
const route = express.Router()

//Upload Images
const multer = require('multer')
const upload = multer()

const controller = require("../../controllers/admin/my-account.controller")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

route.get('/', controller.index)

route.get('/edit', controller.edit)

route.patch('/edit', upload.single('avatar'), uploadCloud.upload, controller.editPatch)

module.exports = route