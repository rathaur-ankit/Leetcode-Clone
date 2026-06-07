const { Problem } = require("../models/problem");
const { User } = require("../models/User");
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    referenceSolution,
    startCode,
    problemCreator,
  } = req.body;
  try {
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await submitBatch(submissions);
      const resultToken = submitResult.map((value) => value.token);
      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id != 3) return res.status(400).send("Error Occured");
      }
    }
    const userProblem = await problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });
    res.status(201).send("Problem Saved Successfully");
  } catch (err) {
    res.status(400).send("error " + err.message);
  }
};
const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    referenceSolution,
    startCode,
    problemCreator,
  } = req.body;
  try {
    if (!id) {
      return res.status(400).send("Id missing");
    }
    const DSAproblem = await Problem.findById({ id });
    if (!DSAproblem) {
      return res.status(404).send("Id is not present");
    }
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await submitBatch(submissions);
      const resultToken = submitResult.map((value) => value.token);
      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id != 3) return res.status(400).send("Error Occured");
      }
    }
    const newProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true },
    );
    res.status(200).send(newProblem);
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
};
const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("Id is missing");
    const deleteProblem = await Problem.findByIdAndDelete({ id });
    if (!deleteProblem) return res.status(400).send("Problem is missing");
    res.status(200).send("Problem deleted successfully");
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
};
const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("id is missing");
    const getProblem = await Problem.findById({ id });
    if (!getProblem) return res.status(400).send("Problem doesn't exist");
    res.status(200).send(getProblem);
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
};
const getAllProblem = async (req, res) => {
  try {
    const allProblem = await Problem.find({}).select(
      "_id title difficulty tags",
    );
    if (allProblem.length == 0)
      return res.status(400).send("Problem is missing");
    res.status(200).send(allProblem);
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
};

const allSolvedProblemByUser = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });
    res.status(200).send(user.solvedProblem);
  } catch (err) {
    res.status(500).send("server error " + err.message);
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  allSolvedProblemByUser,
};
