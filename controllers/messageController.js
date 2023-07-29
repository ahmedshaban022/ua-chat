const expressAsyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");

const Message=require('../Models/Message');
const User = require("../Models/userModel");


const sendMessage=expressAsyncHandler(async(req,res)=>{

const {content,chatId}=req.body;

    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
let newMessage={
    sender:req.user._id,
    content:content,
    chat:chatId
}

try {
    let message=await Message.create(newMessage);

    message = await message.populate("sender","name pic");
    message = await message.populate("chat");
    message = await User.populate(message,{
        path:'chat.Users',
        select:"name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId,{
        latestMessage:message,
    });
    res.json(message);

} catch (error) {
    res.status(400);
    throw new Error (error.message)
}


});

const allMessages = expressAsyncHandler(async(req,res)=>{
try {
    const messages = await Message.find({chat:req.params.chatId})
    .populate("sender","name pic email").populate('chat')
    res.json(messages)
} catch (error) {
    res.status(400);
    throw new Error (error.message);

}
    

})

module.exports={sendMessage,allMessages}