require('dotenv').config();

//models
const Coupon = require("../models/Coupon");
const Booking = require("../models/Booking");


exports.getCoupons = async(req,res,next) => {

    try{
        const coupons = await Coupon.find({startDate:{$lte:new Date()},endDate:{$gte:new Date()}});

        return res.status(200).json({
            status:true,
            msg:"",
            coupons
        });

    }catch(err){
        return res.status(200).json({
            status:false,
            msg:err.message
        });
    }
};

exports.checkCoupons = async(req,res,next) => {

    try{
        const user = req.user;
        const body = req.body;
        const coupon = await Coupon.findOne({code:body.coupon_code});

        if(!coupon){
            return res.status(200).json({
                status:false,
                msg:'coupon with this code does not exist'
            });
        }

        if(!coupon.isGlobal && coupon.user != user._id){
            return res.status(200).json({
                status:false,
                msg:'this coupon is not for this user'
            });
        }

        if(coupon.maxAmount < body.amount){
            return res.status(200).json({
                status:false,
                msg:`this coupon is valid for amount lesser than ${coupon.maxAmount}`
            });
        }
        if(coupon.minAmount > body.amount){
            return res.status(200).json({
                status:false,
                msg:`this coupon is valid for amount greater than ${coupon.minAmount}`
            });
        }

        if(!coupon.isGlobal && coupon.user != user._id){
            return res.status(200).json({
                status:false,
                msg:'this coupon is not for this user'
            });
        }

        const userBookingCount = await Booking.find({user:user._id,coupon:coupon._id}).count();
        const bookingCount = await Booking.find({coupon:coupon._id}).count();


        if(coupon.maximumPerCustomerUse <= userBookingCount){
            return res.status(200).json({
                status:false,
                msg:'you have exceed the limit use this coupon'
            });
        }
        if(coupon.maximumTotalUse <= bookingCount){
            return res.status(200).json({
                status:false,
                msg:'Users exceed the limit to use this coupon'
            });
        }

        let discount = coupon.type == 'fixed' ? coupon.discount : (body.amount*coupon.discount/100);

        let amountAfterDiscount = body.amount - discount;

        return res.status(200).json({
            status:true,
            msg:"",
            coupon,
            discount,
            amountAfterDiscount
        });

    }catch(err){
        return res.status(200).json({
            status:false,
            msg:err.message
        });
    }

}
