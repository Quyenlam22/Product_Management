const express = require("express")
const route = express.Router()

const controller = require("../../controllers/client/users.controller")

route.get('/not-friend', controller.notFriend)

route.get('/request', controller.request)

route.get('/accept', controller.accept)

module.exports = route