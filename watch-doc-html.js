#!/usr/bin/env node
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const argv = process.argv.slice(2);
let inputArg = null;
let rootArg = null;

for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i];
  if (arg === "--root") {
    rootArg = argv[i + 1];
    i += 1;
  } else if (arg.startsWith("--root=")) {
    rootArg = arg.slice("--root=".length);
  } else if (!inputArg) {
    inputArg = arg;
  }
}

if (!inputArg) {
  console.error("Usage: node watch-doc-html.js <path-to-markdown-file> [--root <dir>]");
  process.exit(1);
}

const markdownPath = path.resolve(process.cwd(), inputArg);
if (!markdownPath.toLowerCase().endsWith(".md")) {
  console.error("Expected a .md file path.");
  process.exit(1);
}

if (!fs.existsSync(markdownPath)) {
  console.error(`Markdown file not found: ${markdownPath}`);
  process.exit(1);
}

const htmlPath = markdownPath.replace(/\.md$/i, "-doc.html");
const syncScriptPath = path.join(__dirname, "sync-doc-html.js");
const syncArgs = [syncScriptPath, markdownPath];
if (rootArg) syncArgs.push("--root", path.resolve(process.cwd(), rootArg));

let timer = null;
let running = false;
let pending = false;

const runSync = () => {
  if (running) {
    pending = true;
    return;
  }

  running = true;
  const child = spawn(process.execPath, syncArgs, {
    cwd: path.dirname(markdownPath),
    stdio: "inherit"
  });

  child.on("exit", (code) => {
    running = false;
    if (code === 0) {
      console.log(`[sync] Updated ${path.basename(htmlPath)}`);
    } else {
      console.error(`[sync] Failed with exit code ${code}`);
    }

    if (pending) {
      pending = false;
      runSync();
    }
  });
};

const scheduleSync = () => {
  clearTimeout(timer);
  timer = setTimeout(runSync, 150);
};

console.log(`Watching ${markdownPath}`);
console.log("Press Ctrl+C to stop.");

runSync();

fs.watchFile(markdownPath, { interval: 500 }, (current, previous) => {
  if (current.mtimeMs !== previous.mtimeMs || current.size !== previous.size) {
    scheduleSync();
  }
});

process.on("SIGINT", () => {
  fs.unwatchFile(markdownPath);
  process.exit(0);
});
