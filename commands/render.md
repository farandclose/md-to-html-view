---
description: Render a Markdown file as a clean, read-only, Google-Doc-style HTML page
argument-hint: <path/to/file.md>
---

Render the Markdown file at `$ARGUMENTS` as a polished, read-only, Google-Doc-style HTML page using the **md-to-html-view** skill.

Run the bundled generator:

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/md-to-html-view/scripts/sync-doc-html.js" "$ARGUMENTS"
```

Then report the path to the generated `*-doc.html` file so the user can open it.

If the source document uses fenced code blocks, images, or nested lists, warn the user that those render incorrectly — the renderer supports a deliberate Markdown subset (headings, paragraphs, rules, flat lists, blockquotes, tables, and inline code/bold/italic/links).
