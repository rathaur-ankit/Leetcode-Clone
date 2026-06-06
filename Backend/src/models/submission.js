const mongoose = require("mongoose");
const { Schema } = mongoose;

const submissionSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["java", "cpp", "python"],
    },
    status: {
      type: String,
      enum: ["accepted", "pending", "wrong anser", "compilation error"],
      default: "pending",
    },
    runtime: {
      type: Number,
      default: 0,
    },
    memory: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    testCasesTotal: {
      type: Number,
      defaul: 0,
    },
  },
  { timestamps: true },
);

const submissions = mongoose.model("submission", submissionSchema);
module.exports = { submissions };
