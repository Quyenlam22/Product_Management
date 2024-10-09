const express = require("express")
const route = express.Router()

//Upload Images
const multer  = require('multer')
const storageMulter = require("../../helpers/storageMulter")
const upload = multer({ storage: storageMulter() })

const controller = require("../../controllers/admin/product.controller")

route.get('/', controller.index)

route.patch('/change-status/:status/:id', controller.changeStatus)

route.patch('/change-multi', controller.changeMulti)

route.delete('/delete/:id', controller.deletedItem)

route.get('/create', controller.create)

route.post('/create', upload.single('thumbnail'), controller.createPost)

module.exports = route