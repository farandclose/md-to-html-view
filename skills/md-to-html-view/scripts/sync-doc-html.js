#!/usr/bin/env node
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
  console.error("Usage: node sync-doc-html.js <path-to-markdown-file> [--root <dir>]");
  process.exit(1);
}

const markdownPath = path.resolve(process.cwd(), inputArg);
if (!markdownPath.toLowerCase().endsWith(".md")) {
  console.error("Expected a .md file path.");
  process.exit(1);
}

if (!fs.existsSync(markdownPath)) {
  throw new Error(`Markdown file not found: ${markdownPath}`);
}

const htmlPath = markdownPath.replace(/\.md$/i, "-doc.html");
const templatePath = path.join(__dirname, "..", "assets", "doc-template.html");
const sourcePattern = /(<script\b(?=[^>]*\btype="text\/plain")(?=[^>]*\bid="markdown-source")[^>]*>)([\s\S]*?)(<\/script>)/;

const markdownRaw = fs.readFileSync(markdownPath, "utf8");
const markdown = markdownRaw.replace(/<\/script/gi, "<\\/script");

// Resolve a root for the "Source:" path label, in priority order:
//   1. an explicit --root <dir>
//   2. the nearest ancestor containing a .git folder
//   3. the markdown file's own directory (label shows just the filename)
const repoRoot = (() => {
  if (rootArg) return path.resolve(process.cwd(), rootArg);
  let dir = path.dirname(markdownPath);
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, ".git"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return path.dirname(markdownPath);
})();

const relSourcePath = path.relative(repoRoot, markdownPath) || path.basename(markdownPath);

const deriveTitle = (md, fallbackPath) => {
  const h1 = md.split(/\r?\n/).find((line) => /^#\s+\S/.test(line));
  if (h1) return h1.replace(/^#\s+/, "").trim();
  return path.basename(fallbackPath, ".md").replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const title = deriveTitle(markdownRaw, markdownPath);

const escapeHtmlAttr = (value) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const ensureHtml = () => {
  if (fs.existsSync(htmlPath)) return fs.readFileSync(htmlPath, "utf8");

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  const template = fs.readFileSync(templatePath, "utf8");
  const scaffolded = template
    .replace(/\{\{TITLE\}\}/g, escapeHtmlAttr(title))
    .replace(/\{\{SOURCE_PATH\}\}/g, escapeHtmlAttr(relSourcePath));
  fs.writeFileSync(htmlPath, scaffolded);
  console.log(`[sync] Scaffolded ${path.basename(htmlPath)} from template.`);
  return scaffolded;
};

const html = ensureHtml();

if (!sourcePattern.test(html)) {
  throw new Error("Could not find markdown-source script tag in HTML.");
}

const nextHtml = html.replace(
  sourcePattern,
  (_match, openTag, _source, closeTag) => `${openTag}${markdown}${closeTag}`
);

fs.writeFileSync(htmlPath, nextHtml);
