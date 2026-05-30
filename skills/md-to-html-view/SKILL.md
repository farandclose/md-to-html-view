---
name: md-to-html-view
description: Use when the user wants to view, preview, share, render, or review a Markdown (.md) file as a clean, read-only, Google-Doc-style HTML page. Triggers on requests to "turn this markdown into HTML", "make a shareable/printable version of this .md", or "open this doc as a page". Produces a self-contained sibling <name>-doc.html. Requires Node.js; zero third-party dependencies, fully offline.
---

# md-to-html-view

## Overview

Converts a Markdown file into a polished, **read-only, Google-Doc-style HTML page** you can open in a browser, print, or send to someone. Output is one self-contained file — no external assets, no network, no API calls. The conversion is deterministic: the same Markdown always renders the same HTML.

## When to use

- The user wants to preview or share a `.md` file as a styled page instead of raw text.
- The user wants a printable or send-able version of a document without a static-site generator or hosting.
- The user wants the rendered view to update as they edit (use watch mode).

**When NOT to use:**

- The Markdown is untrusted/third-party content — the renderer is for trusted docs.
- The doc relies on **fenced code blocks, images, or nested lists** — these render incorrectly (see Supported subset).

## Usage

The skill bundles the generator. Run it with Node, passing the path to the `.md` file:

```bash
node "<skill-dir>/scripts/sync-doc-html.js" path/to/foo.md
```

This writes a sibling `path/to/foo-doc.html`. Open it in any browser. Then tell the user the generated file path.

**Watch mode** — regenerate automatically on every edit (leave running, refresh the browser, Ctrl+C to stop):

```bash
node "<skill-dir>/scripts/watch-doc-html.js" path/to/foo.md
```

**Source label** — the page header subtitle ("Read-only render of file: …") shows the source file path. It's resolved as: `--root <dir>` if passed → nearest ancestor with a `.git` folder → the file's own directory.

```bash
node "<skill-dir>/scripts/sync-doc-html.js" docs/notes.md --root .
```

`<skill-dir>` is the directory containing this `SKILL.md`. In a Claude Code plugin, that path is `${CLAUDE_PLUGIN_ROOT}/skills/md-to-html-view`.

## Supported Markdown (quick reference)

| Supported | Not supported (renders incorrectly) |
|-----------|-------------------------------------|
| Headings `#`–`####`, paragraphs, `---` rules | Fenced code blocks (```` ``` ````) |
| Ordered & unordered lists (flat) | Nested lists |
| Blockquotes, GitHub-style tables | Images |
| Inline: `code`, **bold**, _italic_, links | — |

## Common mistakes

- Passing a non-`.md` path — the generator only accepts `.md` files.
- Expecting fenced code blocks or images to render — they don't; warn the user first if the doc uses them.
- Forgetting Node.js is required — if `node` is missing, the script can't run.
- Looking for the output elsewhere — it's always written next to the source as `<name>-doc.html`.
