# md-to-html-view

Render any Markdown file as a clean, Google-Doc-style, read-only HTML page.
Zero dependencies, no build step, no network or API calls. Just Node.js to
generate and a browser to view.

## Why

Sometimes you want to share or review a Markdown document as a polished page
instead of raw text, without a static-site generator or pushing to a service.
This tool takes any `path/to/foo.md` and produces a self-contained sibling
`path/to/foo-doc.html` you can open directly or send to someone.

- Self-contained output: one HTML file, no external assets, works offline.
- Deterministic: the same Markdown always renders the same HTML. No LLM,
  no API, no tokens spent.
- Tiny: three small files, only Node's standard library.

## Requirements

Node.js 14 or newer. No `npm install` needed (there are no third-party deps).

## Quick start

```bash
# Generate foo-doc.html next to foo.md
node sync-doc-html.js path/to/foo.md

# Try the bundled example
node sync-doc-html.js examples/sample.md
```

Open the generated `*-doc.html` in any browser.

## Watch mode

Re-generate automatically whenever the Markdown changes:

```bash
node watch-doc-html.js path/to/foo.md
```

Leave it running while you edit, then refresh the browser. Ctrl+C to stop.

## How it works

1. `sync-doc-html.js` reads your Markdown file.
2. If the sibling HTML does not exist, it scaffolds one from
   `doc-template.html`, filling in the title (first `# H1`, or the filename)
   and a source-path label.
3. It injects the raw Markdown into a
   `<script type="text/plain" id="markdown-source">` block in that HTML.
4. Opening the HTML runs a small inline parser that converts the Markdown to
   styled HTML in the browser.

Generation is plain file and string work in Node. Rendering is a small
client-side parser. Nothing leaves your machine.

## Files

- `sync-doc-html.js`: one-shot generator.
- `watch-doc-html.js`: watcher (runs once on start, then on every change).
- `doc-template.html`: the page shell plus the inline Markdown renderer.
  Placeholders: `{{TITLE}}` and `{{SOURCE_PATH}}`.

## Supported Markdown

Headings (`#` through `####`), paragraphs, `---` rules, ordered and unordered
lists, blockquotes, GitHub-style tables, and inline formatting (code, bold,
italic, links).

Not supported (will render incorrectly): fenced code blocks, images, and
nested lists. The renderer is intentionally minimal; for the supported subset
it is fast and reliable.

## The source-path label

The page header shows a small "Source:" chip with the file path, resolved in
this order:

1. `--root <dir>`, if you pass it.
2. The nearest ancestor directory that contains a `.git` folder.
3. The Markdown file's own directory (the chip then shows just the filename).

```bash
node sync-doc-html.js docs/notes.md --root .
```

## License

MIT. See [LICENSE](LICENSE).
