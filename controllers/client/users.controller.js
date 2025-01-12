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

// [GET] /users/friends
module.exports.friends = async (req, res) => {
    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })

    usersSocket(res)

    const friendList = myUser.friendList
    const friendListId = friendList.map(item => item.user_id)

    const users = await User.find({
        _id: {$in: friendListId},
        status: "active",
        deleted: false
    }).select("id avatar fullName statusOnline")
    
    for (const user of users) {
        const infoFriend = friendList.find(friend => friend.user_id == user.id)
        user.infoFriend = infoFriend
    }

    res.render("client/page/users/friends", {
        pageTitle: "Danh sách bạn bè",
        users: users
    })
}