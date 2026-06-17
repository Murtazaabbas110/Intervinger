import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export async function analyzeInterview(data) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const schema = {
    score: 0,
    readability: 0,
    efficiency: 0,
    problemSolving: 0,
    copyPasteRisk: "",
    recommendation: "",
    feedback: "",
  };

  const buildPrompt = (timeline) => `
You are an expert technical interviewer.

Analyze the following coding interview timeline:

${JSON.stringify(timeline)}

STRICT RULES:
- Return ONLY valid JSON.
- Do NOT include markdown.
- Do NOT wrap output in \`\`\` or any text.
- Return all scores in range 0–10 only.
- Output must match this structure exactly:

${JSON.stringify(schema, null, 2)}
`;

  const safeParseJSON = (text) => {
    try {
      return JSON.parse(text);
    } catch (err) {
      return null;
    }
  };

  const generate = async (prompt) => {
    const result = await model.generateContent(prompt);
    return result.response.text();
  };

  // First attempt
  let raw = await generate(buildPrompt(data.timeline));
  let parsed = safeParseJSON(raw);

  // Retry if invalid JSON
  if (!parsed) {
    const fixPrompt = `
The previous response was invalid JSON.

Fix it and return ONLY valid JSON:

${raw}
`;

    raw = await generate(fixPrompt);
    parsed = safeParseJSON(raw);
  }

  // Final fallback (never crash API)
  if (!parsed) {
    return {
      ...schema,
      score: 0,
      feedback: "Failed to parse model output into valid JSON.",
      recommendation: "Model response was malformed.",
    };
  }

  // Basic sanity validation (important guardrail)
  return {
    score: Number(parsed.score) || 0,
    readability: Number(parsed.readability) || 0,
    efficiency: Number(parsed.efficiency) || 0,
    problemSolving: Number(parsed.problemSolving) || 0,
    copyPasteRisk: String(parsed.copyPasteRisk || ""),
    recommendation: String(parsed.recommendation || ""),
    feedback: String(parsed.feedback || ""),
  };
}