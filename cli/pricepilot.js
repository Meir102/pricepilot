#!/usr/bin/env node

const fs = require("fs");

const args = process.argv.slice(2);
const command = args[0];

if (command === "add-route") {
  const route = args[1];

  const code = `

app.get("${route}", (req, res) => {
  res.json({ ok: true, route: "${route}" });
});

`;

  fs.appendFileSync("../backend/server.js", code);
  console.log("✅ Route added:", route);
}

if (command === "log") {
  const text = args[1];

  const code = `console.log("${text}");\n`;
  fs.appendFileSync("../backend/server.js", code);

  console.log("✅ Log added");
}
