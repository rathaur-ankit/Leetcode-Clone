const express = require("express");
const problemRouter = express.Router();
const { adminMiddleware } = require("../Middleware/adminMiddleware");
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  allSolvedProblemByUser,
} = require("../controllers/userProblem");
const { userMiddleware } = require("../Middleware/userMiddleware");

problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRouter.get("/problemById/:id", getProblemById);
problemRouter.get("/getAllProblem", getAllProblem);
problemRouter.get("/problemSolvedByUser", solvedAllProblemByUser);

module.exports = { problemRouter };
