const express = require("express");
const authRouter = express.Router();
const {
  register,
  login,
  logout,
  adminRegister,
  getProfile,
  deleteProfile,
} = require("../controllers/userAuthent");
const { userMiddleware } = require("../Middleware/userMiddleware");
const { adminMiddleware } = require("../Middleware/adminMiddleware");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.get("/getProfile", getProfile);
authRouter.post("/admin/register", adminMiddleware, adminRegister);
authRouter.delete("/profile", userMiddleware, deleteProfile);

module.exports = { authRouter };
