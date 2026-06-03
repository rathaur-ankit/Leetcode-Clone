const express = require("express");
const { model } = require("mongoose");
const authRouter = express.Router();
const {register,login,logout,getProfile}=require("../controllers/userAuthent");

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.get("getProfile",getProfile);

module.exports={authRouter};