const User = require("../../models/user.model")
const RoomChat = require("../../models/rooms-chat.model")

// const uploadToCloudinary = require("../../helpers/uploadToCloudinary")

const realTimeAcceptFriends = async (userId) => {
    // Lấy ra độ dài acceptFriends của B và trả về cho B
    const infoUserB = await User.findOne({
        _id: userId
    })

    const lengthAcceptFriends = infoUserB.acceptFriends.length

    return {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends
    }
}

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

            // Lấy ra độ dài acceptFriends của B và trả về cho B
            const data = await realTimeAcceptFriends(userId)

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", data)

            // Lấy ra thông tin của A và trả về cho B
             const infoUserA = await User.findOne({
                _id: myUserId
             }).select("id avatar fullName")

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            })

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

            const data = await realTimeAcceptFriends(userId)

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", data)

            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userId: userId, // A send to B. B'id
                myUserId: myUserId // A'id
            })
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

            // Lấy ra độ dài acceptFriends của B và trả về cho B
            const data = await realTimeAcceptFriends(myUserId)

            socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", data)
        })

        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            // Thêm (user_id, room_chat_id) của A vào friendList của B
            // Xóa id của A trong acceptFriends của B
           
            //Check exist
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            let roomChat
            if(existIdAinB && existIdBinA){
                const dataRoom = {
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: userId,
                            role: "superAdmin"
                        },
                        {
                            user_id: myUserId,
                            role: "superAdmin"
                        }
                    ]
                }
                roomChat = new RoomChat(dataRoom)
                await roomChat.save()
            }

            if(existIdAinB){
                await User.updateOne({
                    _id: myUserId
                },{
                    $push: {
                      friendList: {
                        user_id: userId,
                        room_chat_id: roomChat.id
                      }  
                    },
                    $pull: {acceptFriends: userId}
                })
            }

            // Thêm (user_id, room_chat_id) của B vào friendList của A
            // Xóa id của B trong requestFriends của A
            
            if(existIdBinA){
                await User.updateOne({
                    _id: userId
                },{
                    $push: {
                        friendList: {
                          user_id: myUserId,
                          room_chat_id: roomChat.id
                        }  
                    },
                    $pull: {requestFriends: myUserId}
                })
            }

            // Lấy ra độ dài acceptFriends của B và trả về cho B
            const data = await realTimeAcceptFriends(myUserId)

            socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", data)
        })
    })
}