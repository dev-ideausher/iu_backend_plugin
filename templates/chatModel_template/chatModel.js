const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ChatChannel",
        required:true
    },
    message:{
        type:String
    },
    media:{
        type:String
    },
    mediaType:{
        type:String
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    isRead:{
        type:Boolean,
        default:false
    }
},
    {timestamps:true, versionKey: false}
)

module.exports = mongoose.model("Chat", chatSchema,"Chat");


