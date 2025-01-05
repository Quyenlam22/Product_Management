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


        socket.on("CLIENT_SEND_TYPING", async (type) => {
            
        })
    })
}