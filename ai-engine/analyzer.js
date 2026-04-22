const fs = require("fs");

function analyzeCode() {
  const file = fs.readFileSync("../backend/server.js", "utf8");

  const suggestions = [];

  if (!file.includes("rate limit")) {
    suggestions.push("Add rate limiting to prevent abuse");
  }

  if (!file.includes("cache")) {
    suggestions.push("Add caching to /search for faster responses");
  }

  if (!file.includes("try")) {
    suggestions.push("Add error handling (try/catch)");
  }

  console.log("🤖 AI Improvement Report:\n");

  suggestions.forEach((s, i) => {
    console.log(`${i + 1}. ${s}`);
  });

  // שמירת דו"ח
  fs.writeFileSync(
    "report.json",
    JSON.stringify({ suggestions }, null, 2)
  );

  console.log("\n✅ Report saved to ai-engine/report.json");
}

analyzeCode();
