const User = require("../../models/user.model")

const userSocket = require("../../sockets/client/user.socket")

module.exports.infoUser = async (req, res, next) => {
    if(req.cookies.tokenUser){
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
            status: "active"
        }).select("-password")

        if(user){
            res.locals.user = user
        }

        // _io.once("connection", (socket) => {
    
        //     socket.on('CLIENT_CLOSE_WEB', async (data) => {
        //         // await User.updateOne({
        //         //     _id: user.id
        //         // }, {
        //         //     statusOnline: "offline"
        //         // })
        //         // userSocket(res, user)
        //         console.log(data)
    
        //     })
        // })
    }  

    next()
}