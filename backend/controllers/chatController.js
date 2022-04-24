const expressAsyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

const accessChat=expressAsyncHandler(async(req,res)=>{
    const {userId}=req.body;
    if(!userId){
        console.log("UserId not sent with the request");
       return res.status(400).send("UserId not sent with the request");
    }
    let isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{ $elemMatch: { $eq: req.user._id}}},
            {users:{ $elemMatch: { $eq: userId}}},
        ]
    }).populate('users','-password').populate('latestMessage');
    isChat= await User.populate(isChat,{
        path:'latestMessage.sender',
        select:'name pic email'
    });
    if(isChat.length>0){
        res.send(isChat[0])
    }else{
       let chatData={
           chatName:"sender",
           isGroupChat:false,
           users:[req.user._id,userId],
       } ;
       try {
           const createdChat=await Chat.create(chatData)
           const FullChat=await Chat.findOne({_id:createdChat._id}).populate("users","-password")
            res.send(FullChat);
        } catch (error) {
            return res.status(400).send(error.message)
       }
    }
});

const fetchChats= expressAsyncHandler(async(req,res)=>{
    try {
        Chat.find({users:{$elemMatch: { $eq:req.user._id }}})
        .populate("users","-password").populate('groupAdmin',"-password").populate('latestMessage')
        .sort({updatedAt:-1}).then(async(results)=>{
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email",
            });
            res.send(results);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
})

const createGroup=expressAsyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({msg:'Please fill the feilds'})
    }
    let users=JSON.parse(req.body.users);
    if(users.length<2) return res.status(400).send({msg:'group members mus be over 2 users'})

    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        });

        const fullGroupChat= await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");
        res.status(200).json(fullGroupChat);
        
    } catch (error) {
        return res.status(400).send({msg:error.message})
    }

}) 
const renameGroup=expressAsyncHandler(async(req,res)=>{
    const {chatId,chatName} =req.body;
    const chat= await Chat.findByIdAndUpdate(chatId,{chatName},{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!chat){return res.status(400).send({msg:"cant update"})}
else{
    res.json(chat)
}

});

const addToGroup=expressAsyncHandler(async(req,res)=>{

const {chatId,userId}=req.body;
    const added= await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId},
    },{new:true}).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!added){return res.status(400).send({msg:"cant not found"})}
    else{
        res.json(added)
    }

});

const removeFromGroup=expressAsyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;
    const removed= await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId},
    },{new:true}).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!removed){return res.status(400).send({msg:"cant not found"})}
    else{
        res.json(removed)
    }

})



module.exports={accessChat,fetchChats,createGroup,renameGroup,addToGroup,removeFromGroup,addToGroup}