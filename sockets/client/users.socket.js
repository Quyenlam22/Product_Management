const User = require("../../models/user.model")

// const uploadToCloudinary = require("../../helpers/uploadToCloudinary")

module.exports = (res) => {
    const myUserId = res.locals.user.id

    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            // Thêm id của A vào acceptFriends của B
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if(!existIdAinB){
                await User.updateOne({
                    _id: userId
                },{
                    $push: {acceptFriends: myUserId}
                })
            }

            // Thêm id của B vào requestFriends của A
            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if(!existIdBinA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $push: {requestFriends: userId}
                })
            }
        })

        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            // Xóa id của A trong acceptFriends của B
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if(existIdAinB){
                await User.updateOne({
                    _id: userId
                },{
                    $pull: {acceptFriends: myUserId}
                })
            }

            // Xóa id của B trong requestFriends của A
            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if(existIdBinA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $pull: {requestFriends: userId}
                })
            }
        })

        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            // Xóa id của A trong acceptFriends của B
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if(existIdAinB){
                await User.updateOne({
                    _id: myUserId
                },{
                    $pull: {acceptFriends: userId}
                })
            }

            // Xóa id của B trong requestFriends của A
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if(existIdBinA){
                await User.updateOne({
                    _id: userId
                },{
                    $pull: {requestFriends: myUserId}
                })
            }
        })

        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            // Thêm (user_id, room_chat_id) của A vào friendList của B
            // Xóa id của A trong acceptFriends của B
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if(existIdAinB){
                await User.updateOne({
                    _id: myUserId
                },{
                    $push: {
                      friendList: {
                        user_id: userId,
                        room_chat_id: ""
                      }  
                    },
                    $pull: {acceptFriends: userId}
                })
            }

            // Thêm (user_id, room_chat_id) của B vào friendList của A
            // Xóa id của B trong requestFriends của A
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if(existIdBinA){
                await User.updateOne({
                    _id: userId
                },{
                    $push: {
                        friendList: {
                          user_id: userId,
                          room_chat_id: ""
                        }  
                    },
                    $pull: {requestFriends: myUserId}
                })
            }

        })
    })
}