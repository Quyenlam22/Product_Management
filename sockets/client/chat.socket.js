const Chat = require("../../models/chat.model")

const uploadToCloudinary = require("../../helpers/uploadToCloudinary")

module.exports = (req, res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    const roomChatId = req.params.roomChatId;

    _io.once('connection', (socket) => {
        socket.join(roomChatId)

        socket.on("CLIENT_SEND_MESSAGE", async (data) => {      
            const images = []
            for (const imageBuffer of data.images) {
                const link = await uploadToCloudinary(imageBuffer)
                images.push(link)
            }

            const chat = new Chat({
                user_id: userId,
                room_chat_id: roomChatId,
                content: data.content,
                images: images
            })
            await chat.save()

            _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            })
        })

        // Typing
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                fullName: fullName,
                userId: userId,
                type: type
            })
        })
    })
}