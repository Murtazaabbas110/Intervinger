import mongoose from "mongoose";

const interviewReportSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    // IMPORTANT FIX:
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    readability: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    efficiency: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    problemSolving: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    copyPasteRisk: {
      type: String,
      default: "Unknown",
      trim: true,
    },

    recommendation: {
      type: String,
      default: "",
      trim: true,
    },

    feedback: {
      type: String,
      default: "",
    },

    // VERY IMPORTANT FOR DEBUGGING AI
    rawAiResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // helps you track failures instead of silent breaks
    status: {
      type: String,
      enum: ["generated", "failed", "partial"],
      default: "generated",
    },
  },
  {
    timestamps: true,
  },
);

// still enforce 1 report per session
interviewReportSchema.index({ sessionId: 1 }, { unique: true });

const InterviewReport = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);

export default InterviewReport;
