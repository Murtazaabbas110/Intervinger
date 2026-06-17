import mongoose from "mongoose";

const interviewActivitySchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      enum: ["typing", "paste", "run_code", "tab_switch"],
      required: true,
    },

    codeSnapshot: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "javascript",
    },
  },
  { timestamps: true },
);

const InterviewActivity = mongoose.model(
  "InterviewActivity",
  interviewActivitySchema,
);

export default InterviewActivity;
