require('dotenv').config();

//models
const Coupon = require("../../models/Coupon");
const User = require('../../models/User');
const APIFeatures = require('../../utils/apiFeatures');
const Email = require('../../utils/email');
const { sendNotification } = require('../../utils/notification');


exports.store = async(req,res,next) => {

    try{
        const body = req.body;

        if(body._id){
            const coupon = await Coupon.findByIdAndUpdate(body._id,body,{new:true});

            return res.status(200).json({
                status:true,
                coupon
            });
        }
        const coupon = await Coupon.create(body);

        await sendNotification(
            'All',
            {_id:null},
            `${coupon.name}`,
            `${coupon.description}`,
            "",
            "coupon",
            coupon._id,
            {},
            1
        );

        let html = `<p>Hey there,</p>
        <p>New vouchers mean new discounts!</p>

        <h6>${coupon.name}</h6>
        <p>${coupon.description} </p>

        <p><a href="${process.env.USER_DYNAMIC_URL}">Click here</a> to purchase tickets using your vouchers.</p>

        <p>Go get 'em!</p>

        <p>Cheers!</p>`;

        SendBulkEmail({},html)

        return res.status(200).json({
            status:true,
            coupon
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            status:false,
            msg:err.message
        });
    }
};

const SendBulkEmail =  async(filter,html) => {

    const users = await User.find(filter);

    users.forEach(async user => {
        await new Email(user,{}).sendEmailWithBody("New voucher added",html);
    });
}

exports.getList = async (req, res) => {
    try {
        const coupons = new APIFeatures(
            Coupon.find().sort({createdAt:-1}),
            req.query
        ).filter().paginate();

        const doc = await coupons.query;

        let totalRows = new APIFeatures(
            Coupon.find(),
            req.query
        ).filter().count();

        totalRows = await totalRows.query;


        res.status(200).json({
            status: true,
            totalRows: totalRows,
            coupons: doc,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            msg: err.message,
        });
    }
};

exports.getDetail = async (req, res) => {
    try {
        const {id} = req.params;
        const coupon = await Coupon.findOne({_id:id});

        res.status(200).json({
            status: true,
            data: coupon,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            msg: err.message,
        });
    }
};


exports.delete = async (req, res) => {
    try {
        const {id} = req.body;
        const coupon = await Coupon.findByIdAndDelete({_id:id});

        res.status(200).json({
            status: true,
            data: coupon
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            msg: err.message,
        });
    }
};
