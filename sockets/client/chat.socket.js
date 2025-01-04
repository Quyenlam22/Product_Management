const Chat = require("../../models/chat.model")

const uploadToCloudinary = require("../../helpers/uploadToCloudinary")

module.exports = (res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName

    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const images = []

            for (const imageBuffer of data.images) {
                const link = await uploadToCloudinary(imageBuffer)
                images.push(link)
            }

            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images
            })
            await chat.save()

            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            })
        })

        // Typing
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                fullName: fullName,
                userId: userId,
                type: type
            })
        })
    })
}