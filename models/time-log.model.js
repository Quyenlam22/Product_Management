const mongoose = require("mongoose")

const timeLoginSchema = new mongoose.Schema({
    account_id: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const TimeLogin = mongoose.model("TimeLog", timeLoginSchema, "time-login")

module.exports = TimeLogin