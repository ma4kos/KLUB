param(
  [string]$RepoRoot = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path $RepoRoot).Path
$PluginDir = Join-Path $RepoRoot "tools\klub-cy-wix\plugin\claude-code-wix-development"
$Manifest = Join-Path $PluginDir ".claude-plugin\plugin.json"

if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
  throw "Claude Code is not installed or is not on PATH. Install it from Anthropic's official instructions, then rerun this command."
}

if (-not (Test-Path $Manifest)) {
  throw "Bundled Wix plugin not found at $PluginDir. Extract the kit under tools\klub-cy-wix in the KLUB repository."
}

Set-Location $RepoRoot
& claude --plugin-dir $PluginDir
