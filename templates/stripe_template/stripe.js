const User = require('../models/User');

const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.addCard = async(user,body) => {
    try{
        let cusId;
        let StripeCustomer;

        const {
            card_number,
            card_date,
            card_cvc,
        } = body;

        const card_exp = card_date.split('-');

        if(user.stripeCustomerId != null){
            cusId = user.stripeCustomerId;
        }else{
            StripeCustomer = await stripe.customers.create({email: user.email});
            cusId = StripeCustomer.id;
            // console.log(user);
            const update_user = await User.findByIdAndUpdate(user._id,{
                stripeCustomerId : StripeCustomer.id
            },{new:true});
            console.log(update_user);
        }
        var param = {};
        param.card ={
            number: card_number,
            exp_month: card_exp[0],
            exp_year:card_exp[1],
            cvc:card_cvc
        }
        const StripeToken = await stripe.tokens.create(param);
        const addCardToCustomer = await stripe.customers.createSource(cusId,{source: StripeToken.id});
        const update_user = await User.findByIdAndUpdate(user._id,{
            stripeCardId : addCardToCustomer.id
        },{new:true});
        console.log(addCardToCustomer);

        return {
            status:true,
            data:addCardToCustomer
        };
    }catch(err){
        return {
            status:false,
            msg:err.message
        };
    }

};

exports.IntentPayment = async(user,body,currency = null) => {

    try{
        console.log(body)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: (body.amount*100).toFixed(0),
            currency: 'usd',
            payment_method_types: ['card'],
            customer: user.stripeCustomerId,
            payment_method: body.card ? body.card : user.stripeCardId,
            confirm:true
        });
        console.log(paymentIntent);
        return {
            status:true,
            data:paymentIntent
        };
    }catch(err){
        console.log(err);
        return {
            status:false,
            msg:err.message
        };
    }


}

getCardId = async(user,limit) => {

    const cards = await stripe.customers.listSources(
        user.stripeCustomerId,
        {object: 'card', limit: limit}
    );

    return cards.data[0].id
}
