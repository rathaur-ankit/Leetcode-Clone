const { Problem } = require("../models/problem");
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");
const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, langugage } = req.body;
    if (!userId || !problemId || !code || !langugage)
      return res.status(400).send("Some fields are missing");
    const problem = await Problem.findById(problemId);
    const submittedResult = await Submission.create({
      userId,
      problem,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });
    const languageId = getLanguageById(langugage);

    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));
    const submitResul = await submitBatch(submissions);
    const resultToken = submitResul.map((value) => value.token);
    const testResult = await submitToken(resultToken);
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;
    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id == 4) {
          status = "error";
          errorMessage = test.stderr;
        } else {
          status = "wrong answer";
          errorMessage = test.stderr;
        }
      }
    }
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();
    if (!req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }
    res.status(201).send(submittedResult);
  } catch (err) {
    res.status(400).send("error " + err.message);
  }
};
const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, langugage } = req.body;
    if (!userId || !problemId || !code || !langugage)
      return res.status(400).send("Some fields are missing");
    const problem = await Problem.findById(problemId);
    const languageId = getLanguageById(langugage);
    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));
    const submitResul = await submitBatch(submissions);
    const resultToken = submitResul.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    res.status(201).send(testResult);
  } catch (err) {
    res.status(400).send("error " + err.message);
  }
};

module.exports = { submitCode, runCode };
