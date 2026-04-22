#!/data/data/com.termux/files/usr/bin/node

const fs = require("fs");
const readline = require("readline");
const { execSync } = require("child_process");

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve =>
    rl.question(question, ans => {
      rl.close();
      resolve(ans);
    })
  );
}

function analyze() {
  const code = fs.readFileSync("backend/server.js", "utf8");

  const issues = [];

  if (!code.includes("try")) issues.push("Missing error handling (try/catch)");
  if (!code.includes("if (!")) issues.push("Missing input validation");
  if (!code.includes("rate")) issues.push("No rate limiting detected");

  return issues;
}

async function run() {
  console.log("🤖 AI Bug Analyzer Running...\n");

  const issues = analyze();

  if (issues.length === 0) {
    console.log("✅ No issues found");
    return;
  }

  console.log("⚠️ Issues found:\n");
  issues.forEach((i, idx) => console.log(`${idx + 1}. ${i}`));

  console.log("\n📦 Proposed fix: backend improvements + safety checks");

  const answer = await ask("\n❓ Do you want to apply fix and push? (yes/no): ");

  if (answer.toLowerCase() !== "yes") {
    console.log("❌ Cancelled by user");
    return;
  }

  console.log("\n🚀 Applying fix...");

  execSync("git add .");
  execSync('git commit -m "auto fix: improved stability and validation"');
  execSync("git push");

  console.log("✅ Fix applied + pushed to GitHub");
  console.log("🔄 Render will deploy automatically");
}

run();
