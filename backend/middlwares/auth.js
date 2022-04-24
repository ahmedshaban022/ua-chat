const jwt=require('jsonwebtoken');
const Users=require('../Models/userModel');
const asyncHandler = require("express-async-handler");

const auth =asyncHandler(async(req,res,next)=>{
let token=req.headers.authorization;


// if(req.headers.authorization ){
    if(token ){
try {
    // token=req.headers.authorization.split(" ")[1];
    // const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const decoded= jwt.verify(token,process.env.JWT_SECRET);

    req.user= await Users.findById(decoded.id).select("-password");
    next();
} catch (error) {
   return res.status(400).send("you are not allowed!***");
}

}
if(!token){
    return res.status(400).send("you are not allowed!");
}

});

module.exports=auth;