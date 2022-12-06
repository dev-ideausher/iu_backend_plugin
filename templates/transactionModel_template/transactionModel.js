const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
        wallet:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Wallet",
            required:true
        },
        txnType: {      // represents the type of transactions performed on a wallet; either a credit or a debit.
            type: String,
            required: true,
            enum: ['credit', 'debit']
        },
        cashChangeType:{
            type:String,
            required:true,
            enum:["redeem",'booking']
        },
        amount:{
            type:Number,
            required:true
        },
        balanceBefore: {
            type: Number,
            required: true,
        },
        balanceAfter: {
            type: Number,
            required: true,
        },
        txnSummary:{
            type: String,
            required: true
        },
        txnDetail:{
            event:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Event'
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            booking:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Booking'
            },
            admin:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Admin'
            },
            details:{
                type:Object
            }
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model("transaction", transactionSchema);
