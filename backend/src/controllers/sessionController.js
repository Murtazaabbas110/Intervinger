import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import InterviewActivity from "../models/InterviewActivity.js";
import InterviewReport from "../models/InterviewReport.js";
import { analyzeInterview } from "../lib/geminiService.js";
import mongoose from "mongoose";

export async function createSession(req, res) {
  let channel = null;
  let createdSession = null;

  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ msg: "Problem and difficulty are required" });
    }

    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // Create chat
    channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });
    await channel.create();

    // Create session
    createdSession = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    // Create video call
    const call = streamClient.video.call("default", callId);
    await call.getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          problem,
          difficulty,
          sessionId: createdSession._id.toString(),
        },
      },
    });

    return res.status(201).json({ session: createdSession });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);

    // Cleanup
    try {
      if (channel) await channel.delete();
      if (createdSession) await Session.findByIdAndDelete(createdSession._id);
    } catch (cleanupError) {
      console.log("Cleanup failed:", cleanupError.message);
    }

    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid session ID" });
    }

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid session ID" });
    }

    // Atomic join operation
    const session = await Session.findOneAndUpdate(
      {
        _id: id,
        status: "active",
        participant: null,
        host: { $ne: userId },
      },
      { participant: userId },
      { new: true },
    );

    if (!session) {
      return res.status(409).json({
        msg: "Session is not joinable (full, completed, or host cannot join).",
      });
    }

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    return res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log("\n==============================");
    console.log("[endSession] START", { id, userId });
    console.log("==============================\n");

    // -------------------------
    // Validate session ID
    // -------------------------
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("[endSession] ❌ Invalid session ID");
      return res.status(400).json({ msg: "Invalid session ID" });
    }

    // -------------------------
    // Fetch session
    // -------------------------
    const foundSession = await Session.findById(id);

    if (!foundSession) {
      console.log("[endSession] ❌ Session not found");
      return res.status(404).json({ msg: "Session not found" });
    }

    console.log("[endSession] Session loaded:", {
      status: foundSession.status,
      callId: foundSession.callId,
    });

    // -------------------------
    // Authorization
    // -------------------------
    if (foundSession.host.toString() !== userId.toString()) {
      console.log("[endSession] ❌ Unauthorized user");
      return res.status(403).json({ msg: "Only host can end session" });
    }

    if (foundSession.status === "completed") {
      console.log("[endSession] ⚠️ Already completed");
      return res.status(400).json({ msg: "Session already completed" });
    }

    // -------------------------
    // Cleanup Stream
    // -------------------------
    try {
      const call = streamClient.video.call("default", foundSession.callId);
      await call.delete({ hard: true });
      console.log("[endSession] Stream deleted");
    } catch (err) {
      console.log("[endSession] Stream error:", err.message);
    }

    // -------------------------
    // Cleanup Chat
    // -------------------------
    try {
      const channel = chatClient.channel("messaging", foundSession.callId);
      await channel.delete();
      console.log("[endSession] Chat deleted");
    } catch (err) {
      console.log("[endSession] Chat error:", err.message);
    }

    // -------------------------
    // Fetch activities
    // -------------------------
    const activities = await InterviewActivity.find({
      sessionId: foundSession._id,
    }).sort({ createdAt: 1 });

    console.log("[endSession] Activities:", activities.length);

    let finalReport = null;

    // -------------------------
    // AI PIPELINE
    // -------------------------
    if (activities.length > 0) {
      try {
        const timeline = activities.map((a) => ({
          eventType: a.eventType,
          timestamp: a.createdAt,
          codeSnapshot: a.codeSnapshot,
        }));

        const finalCode = activities.at(-1)?.codeSnapshot || "";

        console.log("[endSession] Sending AI request...");

        const aiResult = await analyzeInterview({
          timeline,
          finalCode,
        });

        console.log("[endSession] RAW AI RESULT:", aiResult);

        // -------------------------
        // Normalize AI output (VERY IMPORTANT FIX)
        // -------------------------
        let parsed = null;

        if (!aiResult) {
          throw new Error("AI returned null/undefined");
        }

        if (typeof aiResult === "object") {
          parsed =
            aiResult.text ||
            aiResult.response ||
            aiResult.candidates?.[0]?.content?.parts?.[0]?.text ||
            aiResult;
        } else {
          parsed = aiResult;
        }

        // If string → clean + parse
        if (typeof parsed === "string") {
          const cleaned = parsed
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          parsed = JSON.parse(cleaned);
        }

        console.log("[endSession] PARSED AI:", parsed);

        if (!parsed || typeof parsed !== "object") {
          throw new Error("Invalid AI response format");
        }

        // -------------------------
        // Safe report object
        // -------------------------
        const reportPayload = {
          sessionId: foundSession._id,
          candidateId: foundSession.participant || foundSession.host,

          score: Number(parsed.score) || 0,
          readability: Number(parsed.readability) || 0,
          efficiency: Number(parsed.efficiency) || 0,
          problemSolving: Number(parsed.problemSolving) || 0,

          copyPasteRisk: parsed.copyPasteRisk || "Unknown",
          recommendation: parsed.recommendation || "No recommendation",
          feedback: parsed.feedback || "",
        };

        console.log("[endSession] REPORT PAYLOAD:", reportPayload);

        // -------------------------
        // Prevent duplicates + save
        // -------------------------
        const existing = await InterviewReport.findOne({
          sessionId: foundSession._id,
        });

        if (!existing) {
          const created = await InterviewReport.create(reportPayload);

          console.log("[endSession] ✅ REPORT SAVED:", created._id);
          finalReport = created;
        } else {
          console.log("[endSession] ℹ️ Report already exists");
        }
      } catch (err) {
        console.log("[endSession] ❌ AI PIPELINE FAILED");
        console.log(err?.message || err);
      }
    }

    // -------------------------
    // Mark session complete
    // -------------------------
    foundSession.status = "completed";
    await foundSession.save();

    console.log("[endSession] DONE");

    return res.status(200).json({
      session: foundSession,
      report: finalReport,
      reportGenerated: !!finalReport,
      msg: "Session ended successfully",
    });
  } catch (err) {
    console.log("[endSession] CRITICAL ERROR:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function leaveSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid session ID" });
    }

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    // If host is leaving, end the session automatically
    if (session.host.toString() === userId.toString()) {
      // Delete Stream call
      try {
        const call = streamClient.video.call("default", session.callId);
        await call.delete({ hard: true });
      } catch (err) {
        console.log("Stream call delete failed:", err.message);
      }

      // Delete chat channel
      try {
        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();
      } catch (err) {
        console.log("Chat channel delete failed:", err.message);
      }

      session.status = "completed";
      await session.save();

      return res.status(200).json({ session, msg: "Host left: session ended" });
    }

    // If participant is leaving
    if (
      !session.participant ||
      session.participant.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ msg: "You are not a participant of this session" });
    }

    session.participant = null;
    await session.save();

    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.removeMembers([req.user.clerkId]);
    } catch (err) {
      console.log(
        "Failed to remove participant from chat channel:",
        err.message,
      );
    }

    return res.status(200).json({ session, msg: "You have left the session" });
  } catch (error) {
    console.log("Error in leaveSession controller:", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
