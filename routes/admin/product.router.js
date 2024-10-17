const express = require("express")
const route = express.Router()

//Upload Images
const multer  = require('multer')
const storageMulter = require("../../helpers/storageMulter")
const upload = multer({ storage: storageMulter() })

const controller = require("../../controllers/admin/product.controller")
const validate = require("../../validates/admin/product.validate")

route.get('/', controller.index)

route.patch('/change-status/:status/:id', controller.changeStatus)

route.patch('/change-multi', controller.changeMulti)

route.delete('/delete/:id', controller.deletedItem)

route.get('/create', controller.create)

route.post('/create', upload.single('thumbnail'), validate.createPost, controller.createPost)

route.get('/edit/:id', controller.edit)

route.patch('/edit/:id', upload.single('thumbnail'), validate.createPost, controller.editPatch)

route.get('/detail/:id', controller.detail)

module.exports = route