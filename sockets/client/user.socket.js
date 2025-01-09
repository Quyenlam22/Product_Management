module.exports = (res, user) => {
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: user.id,
            status: user.statusOnline
        })
    })
}