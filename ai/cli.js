#!/data/data/com.termux/files/usr/bin/node

const { execSync } = require("child_process");

const cmd = process.argv[2];

function run(c) {
  return execSync(c).toString();
}

if (cmd === "analyze") {
  console.log("🔍 Running analyzer...\n");
  console.log(run("node ai/analyzer.js"));
}

if (cmd === "fix") {
  console.log("🤖 Running fixer...\n");
  console.log(run("node ai/fixer.js"));
}

if (cmd === "deploy") {
  console.log("🚀 Deploying...\n");

  run("git add .");
  run('git commit -m "auto update via AI system"');
  run("git push");

  console.log("✅ Pushed to Git → Render will deploy");
}

if (!cmd) {
  console.log(`
Usage:
  ai analyze
  ai fix
  ai deploy
`);
}
