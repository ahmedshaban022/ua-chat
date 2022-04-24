const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");

const Users= require('../Models/userModel');


const registerUser= expressAsyncHandler(async(req,res)=>{
    const {name,email,password,pic}=req.body;

    if(!name||!email||!password){
        return res.status(400).send("Missing Fields");
    }

    const userExists=await Users.findOne({email});
    if(userExists){
       return  res.status(400).send("email is already exist");
    }

    const user= await Users.create({
        name,email,password,pic
    });
    if(user){
        return res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password
            ,pic:user.pic,
            token:generateToken(user._id)})
    }else{
        return  res.status(400).send("Faild to create user");
    }

});
const loginUser= expressAsyncHandler(async(req,res)=>{

    const {email,password}=req.body;
    if(!email || !password) return res.status(400).send("Email and password are required!");
    const user=await Users.findOne({email});
    if(!user) return res.status(400).send("Email and password is wrong!");

    if(user && (await user.matchPassword(password))){

        res.json({ 
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password
            ,pic:user.pic,
            token:generateToken(user._id)})
        }else{
            return res.status(400).send("Email and password is wrong!");
        }
});

const allUsers=expressAsyncHandler(async(req,res)=>{
    console.log(req.query.search);
    const keyword=req.query.search?{
        $or:[
            {name:{$regex:req.query.search , $options:"i"}},
            {email:{$regex:req.query.search , $options:'i'}},
        ]
    }:{};
    console.log(req.user._id,"////")
    const users=await  Users.find(keyword).find({_id:{ $ne: req.user._id}});
    res.send(users);

})


module.exports={registerUser,loginUser,allUsers}