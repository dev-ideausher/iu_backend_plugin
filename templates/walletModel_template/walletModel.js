const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        balance:{
            type:Number,
            required:true,
            default:0.00
        },
        points:{
            type:Number,
            default:0
        }
    },
    {timestamps:true}
)


module.exports = mongoose.model("Wallet", walletSchema);
