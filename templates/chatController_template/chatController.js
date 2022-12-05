const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const mongoose = require("mongoose");

const ChatChannel = require("../models/chatChannelModel")
const Chat = require("../models/chatModel");
const {sendNotification} = require("../utils/notification");

// create channel
exports.channel = catchAsyncErrors(async(req,res,next) =>{
    let user = req.user;
    const {user2} = req.body;

    let filter; 
    let chatChannel;

    if(user.role ==="user"){
        filter = {user:req.user._id,docter:user2}
    }else if(user.role==="docter"){
        filter = {user:user2,docter:req.user._id}
    }
    chatChannel = await ChatChannel.findOne(filter);

    if(chatChannel){
        return res.status(200).json({
            status:true,
            message:"Channel already exists.",
            chatChannel
        })
    }
    
    chatChannel = await ChatChannel.create(filter)

    res.status(200).json({
        status:true,
        message:"Channel created.",
        chatChannel
    })
})


// blocked channel 
exports.updateChannel = catchAsyncErrors(async(req,res,next) =>{
    let channelId = req.params.channelId;
    const {status} = req.body;

    let channel = await ChatChannel.findById(channelId)
    console.log(channel.user, channel.docter,req.user._id)

    if(JSON.stringify(channel.user)!= JSON.stringify(req.user._id) && JSON.stringify(channel.docter) != JSON.stringify(req.user._id)){
        return next(new ErrorHandler("You can't update this channel.", 400));
    }
    channel = await ChatChannel.findByIdAndUpdate(channelId,{status:status},{new:true})

    res.status(200).json({
        status:true,
        message:"Channel Updated.",
        channel
    })
})


// blocked channel 
exports.deleteChannel = catchAsyncErrors(async(req,res,next) =>{
    let channelId = req.params.channelId;

    let channel = await ChatChannel.findById(channelId)

    if(JSON.stringify(channel.user)!==JSON.stringify(req.user._id) && JSON.stringify(channel.docter) !== JSON.stringify(req.user._id)){
        return next(new ErrorHandler("You can't update this channel.", 400));
    }
    channel = await ChatChannel.findByIdAndDelete(channelId)

    res.status(200).json({
        status:true,
        message:"Channel deleted."
    })
})

//get all channel
exports.getAllChannel = catchAsyncErrors(async(req,res) =>{
    const user = req.user;

    let filter = mongoose.Types.ObjectId(user._id)
    console.log(filter)
    
    let chatChannel = await ChatChannel.aggregate([
        {
            $match: { $or: [{ user: filter }, { docter: filter }] }
        },
        {
            $lookup:{
                from:'users',
                localField:'user',
                foreignField:'_id',
                as: 'user'
            }
        },
        {
            $lookup:{
                from:'users',
                localField:'docter',
                foreignField:'_id',
                as: 'docter'
            }
        },
        {
            $lookup:{
                from:'chats',
                localField:'_id',
                foreignField:'channel',
                as: 'chat'
            }
        },
        { 
            "$addFields": {
            "chat": { "$slice": ["$chat", -1] }
          }
        },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$docter"
        },
        // {
        //     "$unwind":"$chat"
        // },
        
        {
            $lookup:{
                from:'docters',
                localField:'docter._id',
                foreignField:'user',
                as: 'doc'
            }
        },
        {
            $unwind:'$doc'
        },
        {
            $project:{
                "docter":0
            }
        }
        
    ]);

    res.status(200).json({
        status:true,
        message:"All channels of a user",
        chatChannel
    })


})


// create chat message
exports.createChatMessage = catchAsyncErrors(async(req,res,next) =>{
    const user = req.user;
    const {channelId, message,media,mediaType,receiver,sender} = req.body;

    let channel = await ChatChannel.findById(channelId);

    if(!channel || (JSON.stringify(channel.user)!==JSON.stringify(req.user._id) && JSON.stringify(channel.docter) !== JSON.stringify(req.user._id)) ){
        return next(new ErrorHandler("You can't message in this channel.", 400));
    }
    let chat = await Chat.create({
        channel:channelId,
        message:message,
        media:media,
        mediaType:mediaType,
        receiver:receiver,
        sender:sender
    })

    const data = {
        'user_id': sender.toString(),
        'notification_type': 'chat',
        'chat_data' : JSON.stringify(chat)
    };
    //for docter
    await sendNotification(
        receiver.toString(),
        receiver,
        "A message from user",
        `${message}`,
        "chat",
        sender,
        media,
        data
    );


    res.status(200).json({
        status:true,
        message:"Message sent.",
        chat
    })

})

// delete chat 
exports.deleteChatMessage = catchAsyncErrors(async(req,res,next) =>{
    let chatId = req.params.chatId;

    let chat  = await Chat.findById(chatId);

    if(JSON.stringify(chat.sender) != JSON.stringify(req.user._id)){
        return next(new ErrorHandler("You can't delete this message", 400));
    }

    await Chat.findByIdAndDelete(chatId)

    res.status(200).json({
        status:true,
        message:"Message deleted."
    })

})

// update chat messgae
exports.updateChatMessage = catchAsyncErrors(async(req,res,next) =>{
    let chatId = req.params.chatId;

    let chat  = await Chat.findById(chatId);

    if(JSON.stringify(chat.sender) != JSON.stringify(req.user._id)){
        return next(new ErrorHandler("You can't delete this message", 400));
    }

    chat = await Chat.findByIdAndDelete(chatId,req.body,{new:true})

    res.status(200).json({
        status:true,
        message:"Message updated.",
        chat
    })
})

// get all chat 
exports.getAllChat = catchAsyncErrors(async(req,res) =>{
    let channelId = req.params.channelId;

    req.query.channel = channelId

    let chats = new APIFeatures(Chat.find(),req.query).filter().paginate()
    chats = await chats.query;
    
    res.status(200).json({
        status:true,
        chats
    })
})



