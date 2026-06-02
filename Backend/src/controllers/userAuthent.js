const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");


const register = async (req,res) => {
  try {
    validate(req.body);
    const {emailId,password,firstName}=req.body;
    req.body.password = await bcrypt.hash(password, 10);
    await User.create(req.body);
   const token = jwt.sign({_id:User._id,emailId:emailId},process.env.SECRET_KEY,{expiresIn:60*60});
   res.cookie("token",token,{maxAge:60*60*1000});
    res.status(200).send("register successfully");
  } catch (err) {
    res.status(400).send("error " + err);
  }
};

const login=async(req,res)=>{
    try{
    const {emailId,password}=req.body;
    if(!emailId || !password)
        throw new Error("Invalid Credientials");
    const user=await User.findOne({emailId});
    if(!user)
     throw new Error("user does not exist");
    const alllowed=await bcrypt.compare(password,user.password);
    if(!alllowed)
     throw new Error("Invalid Credentials");
    const token=jwt.sign({_id:user._id,emailId:emailId},process.env.SECRET_KEY,{expiresIn:60*60});
    res.cookie("token",token,{maxAge:60*60*1000});
    res.status(200).send("login successfully");
}
catch(err){
  res.status(401).send("err "+err);
}
}

const logout=async (req,res)=>{
    try{

    }
    catch(err){

    }
}
