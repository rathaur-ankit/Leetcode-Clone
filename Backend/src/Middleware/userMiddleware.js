const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { redisClient } = require("../config/redis");

const userMiddleware = async (req, res) => {
  try {
    const { token } = req.cookie;
    if (!token) throw new Error("invalid tokens");
    const payload = await jwt.verify(token, process.env.SECRET_KEY);
    const { _id } = payload;
    if (!_id) throw new Error("id is missing");
    const result = await User.findById({ _id });
    if (!result) throw new Error("user doesn't exist");
    const isBlocked = await redisClient.exists(`token${token}`);
    if (isBlocked) throw new Error("invalid token");
    req.result = result;
    next();
  } catch (err) {
    console.log("error " + err);
  }
};

module.exports={userMiddleware};