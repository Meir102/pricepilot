#!/data/data/com.termux/files/usr/bin/node

const fs = require("fs");
const { execSync } = require("child_process");

const cmd = process.argv[2];

function run(cmd) {
  return execSync(cmd).toString().trim();
}

// 🧠 ANALYZE
function analyze() {
  const code = fs.readFileSync("backend/server.js", "utf8");

  const issues = [];

  if (!code.includes("try")) issues.push("Missing error handling (try/catch)");
  if (!code.includes("rate")) issues.push("No rate limiting detected");
  if (!code.includes("cache")) issues.push("No caching in search endpoint");

  console.log("🤖 AI DEV REPORT:\n");

  if (issues.length === 0) {
    console.log("✅ Code looks stable");
  } else {
    issues.forEach((i, idx) => console.log(`${idx + 1}. ${i}`));
  }
}

// 🚀 AUTO FIX (safe commit pipeline)
function autoFix() {
  console.log("🚀 Running auto dev pipeline...");

  const status = run("git status --porcelain");

  if (!status) {
    console.log("✅ No changes detected");
    return;
  }

  let message = "auto update";

  if (status.includes("server.js")) message = "backend improvements";
  if (status.includes("frontend")) message = "frontend update";

  run("git add .");
  run(`git commit -m "${message}"`);
  run("git push");

  console.log("✅ Git synced successfully");
  console.log("🔄 Render will auto-deploy if connected");
}

// 🧭 ROUTER
if (cmd === "analyze") analyze();
if (cmd === "auto") autoFix();

if (!cmd) {
  console.log(`
Usage:
  controller analyze
  controller auto
`);
}
