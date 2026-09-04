#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${1:-$(pwd)}"
REPO_ROOT="$(cd "$REPO_ROOT" && pwd)"
PLUGIN_DIR="$REPO_ROOT/tools/klub-cy-wix/plugin/claude-code-wix-development"

if ! command -v claude >/dev/null 2>&1; then
  echo "Claude Code is not installed or is not on PATH." >&2
  echo "Install Claude Code from the official Anthropic instructions, then rerun this command." >&2
  exit 1
fi

if [[ ! -f "$PLUGIN_DIR/.claude-plugin/plugin.json" ]]; then
  echo "Bundled Wix plugin not found at: $PLUGIN_DIR" >&2
  echo "Extract the kit so its contents are under tools/klub-cy-wix in the KLUB repository." >&2
  exit 1
fi

cd "$REPO_ROOT"
exec claude --plugin-dir "$PLUGIN_DIR"
