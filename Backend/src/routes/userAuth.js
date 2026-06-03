const express = require("express");
const { model } = require("mongoose");
const authRouter = express.Router();
const {
  register,
  login,
  logout,
  adminRegister,
  getProfile,
} = require("../controllers/userAuthent");
const { userMiddleware } = require("../Middleware/userMiddleware");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.get("/getProfile", getProfile);
authRouter.post("/admin/register", adminMiddleware, adminRegister);

module.exports = { authRouter };
