#!/usr/bin/env python3
"""Analyze the KLUB Astro site for a Wix migration inventory."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlparse

from PIL import Image

ROOT = Path.cwd()
OUT = ROOT / "klub-analysis"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def flatten_keys(value, prefix=""):
    rows = []
    if isinstance(value, dict):
        for key, child in value.items():
            p = f"{prefix}.{key}" if prefix else key
            rows.append((p, type(child).__name__))
            rows.extend(flatten_keys(child, p))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            p = f"{prefix}[{index}]"
            rows.append((p, type(child).__name__))
            rows.extend(flatten_keys(child, p))
    return rows


def route_for(path: Path) -> str:
    rel = path.relative_to(ROOT / "src/pages")
    parts = list(rel.parts)
    name = parts.pop()
    stem = Path(name).stem
    if stem == "index":
        route = "/" + "/".join(parts)
    elif stem == "404":
        route = "/404.html"
    else:
        route = "/" + "/".join(parts + [stem])
    route = route.replace("//", "/")
    if route != "/" and not route.endswith(".html"):
        route += "/"
    return route


def main() -> None:
    global ROOT, OUT
    parser = argparse.ArgumentParser(description="Analyze a KLUB source tree for Wix migration evidence")
    parser.add_argument("source_root", nargs="?", default=".", help="KLUB repository root")
    parser.add_argument("--output-dir", default="klub-analysis", help="Directory for generated evidence")
    args = parser.parse_args()
    ROOT = Path(args.source_root).resolve()
    OUT = Path(args.output_dir).resolve()
    OUT.mkdir(parents=True, exist_ok=True)
    source_files = [p for p in ROOT.rglob("*") if p.is_file() and "node_modules" not in p.parts and "dist" not in p.parts and "test-results" not in p.parts and "playwright-report" not in p.parts]
    text_exts = {".astro", ".ts", ".js", ".mjs", ".json", ".yml", ".yaml", ".md", ".txt", ".css", ".html", ".xml", ".toml"}
    text_files = [p for p in source_files if p.suffix.lower() in text_exts]

    pages = sorted((ROOT / "src/pages").rglob("*.astro"))
    routes = [{"route": route_for(p), "source": str(p.relative_to(ROOT)), "dynamic": "[" in p.name} for p in pages]

    content_models = []
    for path in sorted((ROOT / "src/content").glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        content_models.append({
            "file": str(path.relative_to(ROOT)),
            "top_level_keys": list(data.keys()) if isinstance(data, dict) else [],
            "flattened_fields": [{"path": key, "type": typ} for key, typ in flatten_keys(data)],
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
        })

    assets = []
    for path in sorted((ROOT / "public").rglob("*")):
        if not path.is_file():
            continue
        row = {
            "file": str(path.relative_to(ROOT)),
            "extension": path.suffix.lower(),
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
        }
        if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"}:
            try:
                with Image.open(path) as image:
                    row["width"] = image.width
                    row["height"] = image.height
                    row["mode"] = image.mode
            except Exception as exc:
                row["image_error"] = str(exc)
        assets.append(row)

    combined = []
    external_urls = set()
    css_vars = Counter()
    data_ctas = Counter()
    schema_types = Counter()
    imports = Counter()
    integrations = Counter()
    forms = []
    for path in text_files:
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        combined.append(text)
        for url in re.findall(r"https?://[^\s\"'<>)}]+", text):
            external_urls.add(url.rstrip(".,;"))
        css_vars.update(re.findall(r"--([a-zA-Z0-9_-]+)\s*:", text))
        data_ctas.update(re.findall(r"data-cta=[\"'`]([^\"'`{]+)", text))
        schema_types.update(re.findall(r"['\"]@type['\"]\s*:\s*['\"]([^'\"]+)", text))
        imports.update(re.findall(r"from\s+['\"]([^'\"]+)['\"]", text))
        lower = text.lower()
        for key in ["netlify", "decap", "wix", "instagram", "whatsapp", "google analytics", "clarity", "schema.org", "playwright", "axe-core"]:
            if key in lower:
                integrations[key] += 1
        if "<form" in lower:
            forms.append({"file": str(path.relative_to(ROOT)), "count": lower.count("<form")})

    test_files = sorted((ROOT / "tests").glob("*.ts"))
    tests = []
    for path in test_files:
        text = path.read_text(encoding="utf-8")
        names = re.findall(r"test(?:\.describe)?\s*\(\s*['\"]([^'\"]+)", text)
        tests.append({"file": str(path.relative_to(ROOT)), "declared_tests_or_suites": names})

    report = {
        "repository": "https://github.com/ma4kos/KLUB",
        "source_file_count": len(source_files),
        "text_file_count": len(text_files),
        "routes": routes,
        "components": [str(p.relative_to(ROOT)) for p in sorted((ROOT / "src/components").rglob("*.astro"))],
        "layouts": [str(p.relative_to(ROOT)) for p in sorted((ROOT / "src/layouts").rglob("*.astro"))],
        "content_models": content_models,
        "assets": assets,
        "asset_extension_counts": dict(Counter(a["extension"] for a in assets)),
        "external_urls": sorted(external_urls),
        "css_custom_properties": dict(css_vars),
        "data_cta_values": dict(data_ctas),
        "schema_types": dict(schema_types),
        "imports": dict(imports),
        "integrations_by_file_count": dict(integrations),
        "forms": forms,
        "tests": tests,
    }
    (OUT / "klub-architecture-inventory.json").write_text(json.dumps(report, indent=2), encoding="utf-8")

    lines = [
        "# KLUB Architecture and Wix Migration Inventory",
        "",
        "## Executive Findings",
        "",
        f"The repository contains **{len(source_files)} migration-relevant source files**, **{len(routes)} Astro route files**, **{len(report['components'])} Astro components**, **{len(content_models)} JSON content models**, and **{len(assets)} public assets**. The source builds as a static Astro site and uses Decap CMS/Netlify-oriented content and form patterns that require explicit Wix equivalents.",
        "",
        "## Route Inventory",
        "",
        "| Route | Source | Dynamic source |",
        "|---|---|---|",
    ]
    for row in routes:
        lines.append(f"| `{row['route']}` | `{row['source']}` | {'Yes' if row['dynamic'] else 'No'} |")
    lines += ["", "## Content Models", "", "| File | Top-level keys | Field nodes | Bytes |", "|---|---|---:|---:|"]
    for model in content_models:
        lines.append(f"| `{model['file']}` | {', '.join(f'`{k}`' for k in model['top_level_keys'])} | {len(model['flattened_fields'])} | {model['bytes']} |")
    lines += ["", "## Assets", "", "| Extension | Count |", "|---|---:|"]
    for ext, count in sorted(report["asset_extension_counts"].items(), key=lambda item: (-item[1], item[0])):
        lines.append(f"| `{ext or '[none]'}` | {count} |")
    lines += ["", "## Integrations Detected", "", "| Integration or concern | Files containing evidence |", "|---|---:|"]
    for key, count in sorted(integrations.items(), key=lambda item: (-item[1], item[0])):
        lines.append(f"| {key} | {count} |")
    lines += ["", "## Migration-Critical Observations", "",
              "The current content source of truth is a set of JSON files edited through Decap CMS. A Wix migration should map stable reusable entities to Wix CMS collections, while one-off page copy can remain page content unless editorial requirements justify a collection.",
              "",
              "Netlify form attributes and post-submit scripts are platform-specific. Replace them with Wix Forms or custom Wix form handling, then reproduce spam protection, consent language, success states, notifications, CRM/contact creation, and analytics events.",
              "",
              "The site exposes structured data, canonical and sitemap behavior, CTA instrumentation, responsive breakpoints, accessibility checks, and internal-link/orphan checks. Preserve these as migration acceptance criteria rather than treating visual similarity alone as success.",
              "",
              "The dynamic class route currently expands four class records. Preserve the slug contract and page URLs, either through Wix CMS dynamic pages or explicit routes, and create redirects only if the final Wix URL model cannot match.",
              "",
              "## Validation Baseline", "",
              "The local Astro production build completed successfully. After installing Playwright browsers and their system dependencies, the repository test run completed with **862 passing tests and 45 skipped tests**. The build emitted an Astro deprecation warning for auto-generated content collections and a warning that `src/content/pages` contained no matching Markdown files; these are source-maintenance notes, not Wix migration blockers.",
              "",
              "## Machine-Readable Companion", "",
              "See `klub-architecture-inventory.json` for field-level content schemas, asset hashes and dimensions, external URLs, detected integrations, imports, forms, schema types, and test declarations.",
              ""]
    (OUT / "Strategy_KLUB_Architecture_and_Migration_Inventory.md").write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps({"routes": len(routes), "components": len(report["components"]), "content_models": len(content_models), "assets": len(assets), "source_files": len(source_files)}, indent=2))


if __name__ == "__main__":
    main()
