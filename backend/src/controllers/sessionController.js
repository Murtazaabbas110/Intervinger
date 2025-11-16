import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function createSession(req, res) {
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

    //

    //video
    const call = streamClient.video.call("default", callId);
    await call.getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    //chat
    let session;
    try {
      const channel = chatClient.channel("messaging", callId, {
        name: `${problem} Session`,
        created_by_id: clerkId,
        members: [clerkId],
      });
      await channel.create();
      session = await Session.create({
        problem,
        difficulty,
        host: userId,
        callId,
      });
    } catch (channelError) {
      await call.delete({ hard: true }).catch(console.error);
      throw channelError;
    }

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
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
    console.log("Error in getActiveSession controller", error.message);
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
    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ msg: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ msg: "Session not found" });

    if (session.status !== "active")
      return res.status(400).json({ msg: "Cannot Join Completed Session" });

    if (session.host.toString() === userId.toString())
      return res
        .status(400)
        .json({ msg: "Host cannot join their own session as participants" });

    if (session.participant)
      return res.status(409).json({ msg: "Session is full" });

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json(session);
  } catch (error) {
    console.log("Error in joinSession controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ msg: "Session not found" });

    if (session.host.toString() !== userId.toString())
      return res.status(403).json({ msg: "Only Host can end the session" });

    if (session.status === "completed")
      return res.status(400).json({ msg: "Session is already completed" });

    //Deleting Stream Video call And Chat Channel
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    //updating status from active to completed
    session.status = "completed";
    await session.save();

    res.status(200).json({ session, msg: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
