# md-to-html-view

Render any Markdown file as a clean, Google-Doc-style, read-only HTML page.
Zero dependencies, no build step, no network or API calls — just Node.js to
generate and a browser to view.

Ships three ways: as an **agent skill** (Claude Code, Codex CLI, Gemini CLI,
and any `SKILL.md`-compatible agent), as a **Claude Code plugin** installable
from a marketplace, and as a plain **CLI**.

## What it does

Point it at `path/to/foo.md` and it produces a self-contained sibling
`path/to/foo-doc.html` you can open directly, print, or send to someone.

- **Self-contained:** one HTML file, no external assets, works offline.
- **Deterministic:** the same Markdown always renders the same HTML. No LLM,
  no API, no tokens spent.
- **Tiny:** a small generator plus an inline browser renderer, only Node's
  standard library.

Requires Node.js 14+. No `npm install` needed (there are no third-party deps).

## Install

### As a Claude Code plugin (marketplace)

```
/plugin marketplace add farandclose/md-to-html-view
/plugin install md-to-html-view
```

This installs the `md-to-html-view` skill and the `/md-to-html-view:render`
command. Ask Claude to render a `.md` file, or run
`/md-to-html-view:render path/to/foo.md`.

### As a skill for Codex CLI / Gemini CLI / any SKILL.md agent

```bash
git clone https://github.com/farandclose/md-to-html-view.git
cd md-to-html-view
bash install.sh
```

The installer copies the skill into `~/.claude/skills/` (if Claude Code is
present) and `~/.agents/skills/` (the universal location read by Codex,
Gemini, and others). Then ask your agent to render a `.md` file as HTML.

### As a CLI (no agent)

```bash
# Run without installing
npx md-to-html-view path/to/foo.md

# Or from a clone
node skills/md-to-html-view/scripts/sync-doc-html.js examples/sample.md
```

Open the generated `*-doc.html` in any browser.

## Watch mode

Re-generate automatically whenever the Markdown changes:

```bash
node skills/md-to-html-view/scripts/watch-doc-html.js path/to/foo.md
```

Leave it running while you edit, then refresh the browser. Ctrl+C to stop.

## How it works

1. The generator reads your Markdown file.
2. If the sibling HTML does not exist, it scaffolds one from the bundled
   `assets/doc-template.html`, filling in the title (first `# H1`, or the
   filename) and a source-path label.
3. It injects the raw Markdown into a
   `<script type="text/plain" id="markdown-source">` block in that HTML.
4. Opening the HTML runs a small inline parser that converts the Markdown to
   styled HTML in the browser.

Generation is plain file and string work in Node. Rendering is a small
client-side parser. Nothing leaves your machine.

## Repository layout

```
.claude-plugin/
  plugin.json            Claude Code plugin manifest
  marketplace.json       Single-plugin marketplace (powers /plugin install)
skills/
  md-to-html-view/
    SKILL.md             The portable skill (source of truth, all rails)
    scripts/
      sync-doc-html.js   One-shot generator (also the CLI bin)
      watch-doc-html.js  Watcher
    assets/
      doc-template.html  Page shell + inline Markdown renderer
commands/
  render.md              /md-to-html-view:render slash command
install.sh               Cross-agent installer (Codex / Gemini / universal)
examples/                Bundled sample.md and its rendered output
```

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
node skills/md-to-html-view/scripts/sync-doc-html.js docs/notes.md --root .
```

## License

MIT. See [LICENSE](LICENSE).
