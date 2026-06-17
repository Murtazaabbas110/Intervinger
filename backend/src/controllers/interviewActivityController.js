import InterviewActivity from "../models/InterviewActivity.js";

export const saveActivity = async (req, res) => {
  try {
    const activities = req.body;

    console.log("RAW BODY:", JSON.stringify(activities, null, 2));

    if (!Array.isArray(activities)) {
      return res.status(400).json({ msg: "Expected array" });
    }

    const result = await InterviewActivity.insertMany(activities);

    console.log("INSERT SUCCESS COUNT:", result.length);

    res.json({
      success: true,
      inserted: result.length,
    });
  } catch (err) {
    console.error("SAVE ACTIVITY ERROR FULL:", err);

    res.status(500).json({
      msg: err.message,
      name: err.name,
    });
  }
};