const express = require("express");
const submitRouter = express.Router();
const { userMiddleware } = require("../Middleware/userMiddleware");

submitRouter.post("/submit/:id", userMiddleware, userSubmission);
