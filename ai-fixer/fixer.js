#!/data/data/com.termux/files/usr/bin/node

const fs = require("fs");

function fix() {
  const filePath = "../backend/server.js";
  let code = fs.readFileSync(filePath, "utf8");

  const fixes = [];

  // תיקון בסיסי 1: try/catch חסר
  if (!code.includes("try")) {
    fixes.push("Add error handling suggestion");
  }

  // תיקון בסיסי 2: בדיקת null
  if (!code.includes("if (!")) {
    fixes.push("Add input validation checks");
  }

  console.log("🤖 AI Fix Suggestions:\n");

  fixes.forEach((f, i) => {
    console.log(`${i + 1}. ${f}`);
  });

  fs.writeFileSync("fix-report.json", JSON.stringify(fixes, null, 2));

  console.log("\n📦 Fix report saved");
}

fix();
