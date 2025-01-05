// const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

const usersSocket = require("../../sockets/client/users.socket")

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })

    usersSocket(res)

    const users = await User.find({
        $and: [
            {_id: {$ne: userId}},
            {_id: {$nin: myUser.requestFriends}},
            {_id: {$nin: myUser.acceptFriends}}
        ],
        status: "active",
        deleted: false
    }).select("id avatar fullName")
    res.render("client/page/users/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}

// [GET] /users/request
module.exports.request = async (req, res) => {
    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })

    usersSocket(res)

    const users = await User.find({
        _id: {$in: myUser.requestFriends},
        status: "active",
        deleted: false
    }).select("id avatar fullName")

    res.render("client/page/users/request", {
        pageTitle: "Lời mời đã gửi",
        users: users
    })
}

// [GET] /users/accept
module.exports.accept = async (req, res) => {
    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })

    usersSocket(res)

    const users = await User.find({
        _id: {$in: myUser.acceptFriends},
        status: "active",
        deleted: false
    }).select("id avatar fullName")
    
    res.render("client/page/users/accept", {
        pageTitle: "Lời mời đã nhận",
        users: users
    })
}