#!/usr/bin/env python3
"""Validate the KLUB-CY Claude Code migration kit without network or Wix writes."""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

REQUIRED_FILES = [
    "README.md",
    "VALIDATION_REPORT.md",
    "MANUAL_STEPS_BEFORE_RUNNING.md",
    "ONE_SHOT_PROMPT.md",
    "config/target.lock.json",
    "config/.env.klub-cy.example",
    "workflow/KLUB_CY_EXECUTION_WORKFLOW.md",
    "workflow/RECOVERY_PLAN_TEMPLATE.md",
    "scripts/preflight.py",
    "scripts/build-klub-payloads.mjs",
    "scripts/generate_wix_plan.py",
    "scripts/capture-netlify-baseline.mjs",
    "scripts/validate-bsport.mjs",
    "scripts/launch-claude-with-wix-plugin.sh",
    "scripts/launch-claude-with-wix-plugin.ps1",
    "plugin/claude-code-wix-development/.claude-plugin/plugin.json",
    "plugin/claude-code-wix-development/.mcp.json",
    "plugin/claude-code-wix-development/skills/wix-development-expert/SKILL.md",
    "references/evidence/Verified_Live_Wix_API_Contracts.md",
    "references/evidence/Verified_Headless_Path_and_Domain_Cutover.md",
    "references/evidence/screenshots/Wix_Business_Elite_Plan_User_Provided.jpg",
    "references/evidence/Netlify_KLUB_Homepage_Authenticated_Snapshot.html",
    "references/live-schemas/Wix_CMS_Live_Schemas.json",
    "references/live-schemas/Wix_Media_Live_Schemas.json",
    "references/live-schemas/Wix_Backup_Live_Schemas.json",
    "references/live-schemas/Wix_OAuth_App_Live_Schemas.json",
    "references/live-schemas/Wix_Forms_Live_Contracts.json",
    "references/live-schemas/Wix_Duplicate_Site_Live_Schema.json",
    "references/live-schemas/Wix_Query_Data_Items_Live_Schema.json",
    "references/live-schemas/Wix_List_Data_Collections_Live_Schema.json",
    "references/live-schemas/Wix_Generate_File_Upload_URL_Live_Schema.json",
    "references/live-schemas/Wix_Create_Contact_V4_Live_Schema.json",
    "validation/Final_Independent_Audit_Summary.json",
    "validation/Final_Independent_Audit_Summary.csv",
]

EXPECTED = {
    "accountId": "8372deba-8664-4ad5-8212-6c10a7f348b1",
    "siteId": "20f11f6f-6ce3-469d-b44c-df397c750848",
    "displayName": "KLUB-CY",
    "pinnedCommit": "15ec3d93f187f5ec12bee14e8bd7b11692220002",
}

SECRET_PATTERNS = {
    "Wix signed API key": re.compile(r"\bIST\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}"),
    "nonempty Wix API assignment": re.compile(r"(?im)^\s*WIX_API_KEY\s*=\s*\S+"),
    "nonempty Netlify password assignment": re.compile(r"(?im)^\s*KLUB_NETLIFY_PASSWORD\s*=\s*(?!<)[^\s#]+"),
    "nonempty admin password assignment": re.compile(r"(?im)^\s*KLUB_ADMIN_PASSWORD\s*=\s*(?!<)[^\s#]+"),
    "Bearer token": re.compile(r"(?i)Authorization\s*[:=]\s*Bearer\s+[A-Za-z0-9._-]{20,}"),
}

EXCLUDED_PARTS = {"node_modules", ".git", "__pycache__"}


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate the KLUB-CY migration kit")
    parser.add_argument("kit_root", nargs="?", default=str(Path(__file__).resolve().parent.parent))
    parser.add_argument("--plan-dir", help="Optional generated Wix no-write plan to validate")
    args = parser.parse_args()
    root = Path(args.kit_root).resolve()
    errors: list[str] = []
    warnings: list[str] = []

    for relative in REQUIRED_FILES:
        if not (root / relative).is_file():
            errors.append(f"Missing required file: {relative}")
    audit_reports = list((root / "validation" / "independent-audits").glob("Audit_*.md"))
    if len(audit_reports) != 5:
        errors.append(f"Expected 5 independent audit reports, found {len(audit_reports)}")

    for path in root.rglob("*.json"):
        if any(part in EXCLUDED_PARTS for part in path.parts):
            continue
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"Invalid JSON {path.relative_to(root)}: {exc}")

    lock_path = root / "config" / "target.lock.json"
    if lock_path.exists():
        lock = json.loads(lock_path.read_text(encoding="utf-8"))
        actual = {
            "accountId": lock.get("wix", {}).get("accountId"),
            "siteId": lock.get("wix", {}).get("siteId"),
            "displayName": lock.get("wix", {}).get("displayName"),
            "pinnedCommit": lock.get("source", {}).get("pinnedCommit"),
        }
        if actual != EXPECTED:
            errors.append(f"Target/source lock mismatch: expected {EXPECTED}, found {actual}")
        if lock.get("architecture", {}).get("path") != "SELF_MANAGED_HEADLESS_EXISTING_WIX_SITE":
            errors.append("Architecture lock is not self-managed Headless on the existing Wix site")
        if lock.get("architecture", {}).get("newWixSiteAllowed") is True:
            errors.append("Target lock unexpectedly permits a new Wix site")

    prompt_path = root / "ONE_SHOT_PROMPT.md"
    if prompt_path.exists():
        prompt = prompt_path.read_text(encoding="utf-8")
        required_prompt_terms = [
            EXPECTED["accountId"], EXPECTED["siteId"], EXPECTED["displayName"], EXPECTED["pinnedCommit"],
            "SELF-MANAGED HEADLESS", "KLUB_ALLOW_WIX_WRITES", "KLUB_ALLOW_NETLIFY_PRODUCTION_DEPLOY",
            "KLUB_ALLOW_DOMAIN_CUTOVER", "WixREADME", "ListWixSites", "GetSiteContext",
            "65 total items", "validate-bsport.mjs", "RECOVERY_PLAN.md", "never", "completion.json",
        ]
        for term in required_prompt_terms:
            if term not in prompt:
                errors.append(f"One-shot prompt missing required term: {term}")

    env_path = root / "config" / ".env.klub-cy.example"
    if env_path.exists():
        env_text = env_path.read_text(encoding="utf-8")
        for blank in ["KLUB_NETLIFY_PASSWORD=", "WIX_MAIN_DOMAIN="]:
            line = next((item for item in env_text.splitlines() if item.startswith(blank.split("=")[0] + "=")), None)
            if line != blank:
                errors.append(f"Environment example must leave {blank.split('=')[0]} blank")

    text_suffixes = {".md", ".txt", ".json", ".py", ".mjs", ".js", ".ts", ".sh", ".ps1", ".yaml", ".yml", ".toml"}
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in text_suffixes or any(part in EXCLUDED_PARTS for part in path.parts):
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for label, pattern in SECRET_PATTERNS.items():
            if pattern.search(text):
                errors.append(f"Potential {label} in {path.relative_to(root)}")

    for path in [root / "scripts" / "preflight.py", root / "scripts" / "generate_wix_plan.py", root / "scripts" / "validate-kit.py"]:
        if path.exists():
            try:
                compile(path.read_text(encoding="utf-8"), str(path), "exec")
            except SyntaxError as exc:
                errors.append(f"Python syntax error in {path.name}: {exc}")

    if args.plan_dir:
        plan_dir = Path(args.plan_dir).resolve()
        mapping_path = plan_dir / "mapping.json"
        execution_path = plan_dir / "execution-plan.json"
        if not mapping_path.exists() or not execution_path.exists():
            errors.append("Generated plan is missing mapping.json or execution-plan.json")
        else:
            mapping = json.loads(mapping_path.read_text(encoding="utf-8"))
            execution = json.loads(execution_path.read_text(encoding="utf-8"))
            counts = {key: value.get("recordCount") for key, value in mapping.get("collections", {}).items()}
            expected_counts = {
                "KlubClasses": 4,
                "KlubFaqSections": 6,
                "KlubFaqItems": 38,
                "KlubPricingGroups": 4,
                "KlubPricingItems": 12,
                "KlubSiteSettings": 1,
            }
            if counts != expected_counts:
                errors.append(f"Generated collection counts mismatch: {counts}")
            if mapping.get("totalRecords") != 65:
                errors.append(f"Generated totalRecords is not 65: {mapping.get('totalRecords')}")
            if execution.get("mode") != "NO_WRITE_PLAN":
                errors.append("Generated execution plan is not marked NO_WRITE_PLAN")
            if execution.get("targetSiteId") != EXPECTED["siteId"]:
                errors.append("Generated execution plan target site is incorrect")

            allowed_field_types = {"TEXT", "NUMBER", "BOOLEAN", "DATE", "DATETIME", "IMAGE", "DOCUMENT", "URL", "RICH_TEXT", "ARRAY", "OBJECT", "REFERENCE", "MULTI_REFERENCE", "MEDIA_GALLERY", "TIME", "RICH_CONTENT", "COLOR", "VIDEO", "AUDIO", "ADDRESS", "PAGE_LINK", "MEDIA_IMAGE", "MEDIA_VECTOR_ART"}
            for collection_id in expected_counts:
                create_path = plan_dir / "create-collection-requests" / f"{collection_id}.json"
                bulk_path = plan_dir / "bulk-save-requests" / f"{collection_id}.json"
                if not create_path.exists() or not bulk_path.exists():
                    errors.append(f"Missing generated request files for {collection_id}")
                    continue
                create = json.loads(create_path.read_text(encoding="utf-8"))
                bulk = json.loads(bulk_path.read_text(encoding="utf-8"))
                collection = create.get("collection", {})
                if collection.get("id") != collection_id or not collection.get("fields"):
                    errors.append(f"Invalid Create Data Collection body for {collection_id}")
                permissions = collection.get("permissions", {})
                if set(permissions) != {"insert", "update", "remove", "read"}:
                    errors.append(f"Incomplete collection permissions for {collection_id}")
                for field in collection.get("fields", []):
                    if field.get("type") not in allowed_field_types or not field.get("key"):
                        errors.append(f"Invalid field in {collection_id}: {field}")
                    if field.get("type") == "ARRAY":
                        element = field.get("typeMetadata", {}).get("array", {}).get("elementType")
                        if element not in allowed_field_types:
                            errors.append(f"Invalid ARRAY element type in {collection_id}.{field.get('key')}")
                if bulk.get("dataCollectionId") != collection_id or not isinstance(bulk.get("dataItems"), list):
                    errors.append(f"Invalid Bulk Save body for {collection_id}")
                if len(bulk.get("dataItems", [])) != expected_counts[collection_id]:
                    errors.append(f"Bulk Save item count mismatch for {collection_id}")
                for item in bulk.get("dataItems", []):
                    if not item.get("id") or not isinstance(item.get("data"), dict) or not item["data"].get("sourceId"):
                        errors.append(f"Invalid deterministic data item in {collection_id}")

    if any(path.name.lower() in {"wixapikey.txt", ".env.klub-cy.local"} for path in root.rglob("*")):
        errors.append("A real key or local environment file was included in the kit")

    result = {
        "kitRoot": str(root),
        "fileCount": sum(1 for path in root.rglob("*") if path.is_file()),
        "errors": errors,
        "warnings": warnings,
        "status": "PASS" if not errors else "FAIL",
    }
    print(json.dumps(result, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
