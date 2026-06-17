// Piston API is a service for code execution

const JUDGE0_API = "https://ce.judge0.com";

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
};

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const language_id = LANGUAGE_IDS[language];

    if (!language_id) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    // -----------------------------
    // 1. Submit code
    // -----------------------------
    const submitRes = await fetch(
      `${JUDGE0_API}/submissions?base64_encoded=false&wait=false`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_id,
          source_code: code,
          stdin: "",
        }),
      },
    );

    const submitData = await submitRes.json();
    const token = submitData.token;

    if (!token) {
      return {
        success: false,
        error: "Failed to get submission token",
      };
    }

    // -----------------------------
    // 2. Poll result
    // -----------------------------
    let result;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 800));

      const res = await fetch(
        `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
      );

      result = await res.json();

      if (result.status?.id >= 3) break;
    }

    // -----------------------------
    // 3. Parse output
    // -----------------------------
    const stdout = result.stdout || "";
    const stderr = result.stderr || "";
    const compileOutput = result.compile_output || "";

    if (stderr || compileOutput) {
      return {
        success: false,
        output: stdout,
        error: stderr || compileOutput,
      };
    }

    return {
      success: true,
      output: stdout || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}
