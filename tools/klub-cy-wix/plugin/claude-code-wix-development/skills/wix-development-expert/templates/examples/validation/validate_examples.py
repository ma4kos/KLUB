#!/usr/bin/env python3
"""Validate the generated Wix examples without contacting Wix."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
failures: list[str] = []

for path in ROOT.rglob("*.json"):
    if "node_modules" in path.parts:
        continue
    try:
        json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        failures.append(f"Invalid JSON {path.relative_to(ROOT)}: {exc}")

for path in ROOT.rglob("*"):
    if not path.is_file() or "node_modules" in path.parts:
        continue
    if path == Path(__file__).resolve() or path.name == "generate_examples.py":
        continue
    text = path.read_text(encoding="utf-8", errors="ignore")
    if re.search(r"(?:sl\.|sk-|wix_[A-Za-z0-9]{16,})", text):
        failures.append(f"Potential hardcoded secret in {path.relative_to(ROOT)}")

required = [
    "mcp/claude-code-remote.json",
    "sdk/src/oauth-client.ts",
    "sdk/src/api-key-client.ts",
    "rest/src/wix-rest-client.ts",
    "migration/src/build-klub-payloads.mjs",
    "prompts/Prompt_Library.md",
]
for relative in required:
    if not (ROOT / relative).is_file():
        failures.append(f"Missing required example: {relative}")

migration_output = ROOT / "migration/output/manifest.json"
if migration_output.exists():
    manifest = json.loads(migration_output.read_text(encoding="utf-8"))
    expected = {
        "classes": 4,
        "faqSections": 6,
        "faqItems": 38,
        "pricingGroups": 4,
        "pricingItems": 12,
        "siteSettings": 1,
    }
    actual = {k: v["count"] for k, v in manifest["collections"].items()}
    if actual != expected:
        failures.append(f"Unexpected KLUB transform counts: {actual!r} != {expected!r}")

if failures:
    print("\n".join(failures), file=sys.stderr)
    raise SystemExit(1)
print("Example library validation passed.")
