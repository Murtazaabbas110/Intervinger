import InterviewReport from "../models/InterviewReport.js";

export async function getReports(req, res) {
  try {
    const reports = await InterviewReport.find()
      .populate({
        path: "sessionId",
        match: {
          host: req.user._id,
        },
      })
      .populate("candidateId", "name email")
      .sort({ createdAt: -1 });

    const filteredReports = reports.filter((report) => report.sessionId);

    return res.status(200).json(filteredReports);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      msg: "Failed to fetch reports",
    });
  }
}
