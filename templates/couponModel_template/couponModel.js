const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
        name:{
            type:String,
            required:true,
        },
        type:{
            type:String,
            enum:['fixed','percentage'],
            required:true,
        },
        code:{
            type:String,
            unique:true,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        discount:{
            type:String,
            required:true,
        },
        maxAmount:{
            type:String,
            required:true,
        },
        minAmount:{
            type:String,
            required:true,
        },
        startDate:{
            type:Date,
        },
        endDate:{
            type:Date,
        },
        maximumPerCustomerUse:{
            type:Number,
        },
        maximumTotalUse:{
            type:Number,
        },
        couponAdmin:{
            type:String,
        },
        isGlobal:{
            type:Boolean,
            default:1,
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:'User',
        },
        isDeleted:{
            type:Boolean,
            default:0,
        },
        deletedAt:{
            type:Date,
        },
    },
    {timestamps:true});

module.exports = mongoose.model('Coupon', couponSchema);
