const expressAsyncHandler = require("express-async-handler");

const accessChat=expressAsyncHandler(async(req,res)=>{
    const {userId}=req.body;
    if(userId){
        console.log("UserId not sent with the request")
       return res.status(400).send("UserId not sent with the request")
    }
})