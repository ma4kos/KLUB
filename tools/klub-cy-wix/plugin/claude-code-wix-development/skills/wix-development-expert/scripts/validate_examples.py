#!/usr/bin/env python3
"""Run the bundled Wix example-library validator from the correct package root."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = SKILL_ROOT / "templates" / "examples" / "validation" / "validate_examples.py"

if not VALIDATOR.is_file():
    raise SystemExit(f"Bundled validator not found: {VALIDATOR}")

result = subprocess.run(
    [sys.executable, str(VALIDATOR)],
    cwd=VALIDATOR.parents[1],
    check=False,
)
raise SystemExit(result.returncode)
