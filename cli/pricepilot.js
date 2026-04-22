#!/data/data/com.termux/files/usr/bin/node
if (cmd === "deploy") {
  console.log("🚀 Deploying to Git + Render...");

  try {
    const status = execSync("git status --porcelain").toString();

    if (status) {
      console.log("📦 Changes detected, committing...");

      execSync("git add .");
      execSync('git commit -m "auto deploy"');
    }

    execSync("git push");

    console.log("✅ Pushed to GitHub");
    console.log("🔄 Render will auto-deploy now");
  } catch (err) {
    console.log("❌ Deploy failed:", err.message);
  }
}#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");

const cmd = process.argv[2];

if (cmd === "auto-commit") {
  console.log("🤖 Running auto git workflow...");

  // בדיקה מה השתנה
  const status = execSync("git status --porcelain").toString();

  if (!status) {
    console.log("✅ No changes to commit");
    process.exit(0);
  }

  // יצירת message חכם
  let message = "auto update";

  if (status.includes("server.js")) message = "backend update";
  if (status.includes("frontend")) message = "frontend update";

  // Git flow
  execSync("git add .");
  execSync(`git commit -m "${message}"`);
  execSync("git push");

  console.log("🚀 Auto commit done:", message);
}
