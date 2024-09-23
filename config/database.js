const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        console.log("Success !")
    } catch (error) {
        console.log("Error !")
    }
}
mongoose.connect(process.env.MONGO_URL);