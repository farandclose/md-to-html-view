#!/usr/bin/env bash
set -euo pipefail

# md-to-html-view installer
# Installs the md-to-html-view skill for Claude Code, Codex CLI, Gemini CLI,
# and any agent that supports the SKILL.md standard.
# Zero third-party dependencies — requires only Node.js to run the skill.

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_SRC="$REPO_DIR/skills/md-to-html-view"

echo "=== md-to-html-view installer ==="
echo ""

# The skill's scripts run on Node — fail early if it's missing.
if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js not found. Install Node 14+ first: https://nodejs.org" >&2
  exit 1
fi

INSTALLED=()

install_to() {
  local dest="$1"
  mkdir -p "$dest"
  rm -rf "$dest/md-to-html-view"
  cp -R "$SKILL_SRC" "$dest/"
  chmod +x "$dest/md-to-html-view/scripts/"*.js 2>/dev/null || true
  INSTALLED+=("$dest/md-to-html-view")
}

# Claude Code (only if present)
if [ -d "$HOME/.claude" ]; then
  install_to "$HOME/.claude/skills"
fi

# Codex CLI / Gemini CLI / universal SKILL.md location.
# ~/.agents/skills is the canonical user-scope path read by Codex and others.
install_to "$HOME/.agents/skills"

echo "Installed the md-to-html-view skill to:"
for t in "${INSTALLED[@]}"; do
  echo "  - $t"
done
echo ""
echo "Use it by asking your agent to render a .md file as HTML, or run directly:"
echo "  node \"$SKILL_SRC/scripts/sync-doc-html.js\" path/to/file.md"
echo ""
echo "Done."
