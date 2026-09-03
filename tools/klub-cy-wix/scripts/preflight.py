#!/usr/bin/env python3
"""Read-only KLUB-CY Wix/Netlify migration preflight.

This script never mutates Wix, Netlify, DNS, Git, or local source files outside the
selected state directory. It never prints or persists credentials.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

PACKAGE_ROOT = Path(__file__).resolve().parent.parent
TARGET_LOCK = PACKAGE_ROOT / "config" / "target.lock.json"


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        raise FileNotFoundError(f"Environment file not found: {path}")
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def load_api_key(env: dict[str, str], repo_root: Path) -> str:
    direct = os.environ.get("WIX_API_KEY") or env.get("WIX_API_KEY")
    if direct:
        return direct.strip()
    key_path_value = os.environ.get("WIX_API_KEY_FILE") or env.get("WIX_API_KEY_FILE")
    if not key_path_value:
        raise RuntimeError("Set WIX_API_KEY_FILE in the local env file or WIX_API_KEY in the shell")
    key_path = Path(key_path_value).expanduser()
    if not key_path.is_absolute():
        key_path = repo_root / key_path
    if not key_path.exists():
        raise FileNotFoundError(f"Wix API key file not found: {key_path}")
    text = key_path.read_text(encoding="utf-8")
    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("WIX_API_KEY="):
            value = line.split("=", 1)[1].strip()
            if value:
                return value
    if text.strip() and "\n" not in text.strip():
        return text.strip()
    raise RuntimeError("WIX_API_KEY was not found in the configured key file")


def request_json(
    method: str,
    url: str,
    api_key: str,
    *,
    site_id: str | None = None,
    account_id: str | None = None,
    body: dict[str, Any] | None = None,
) -> dict[str, Any]:
    headers = {"Authorization": api_key, "Accept": "application/json"}
    if site_id:
        headers["wix-site-id"] = site_id
    if account_id:
        headers["wix-account-id"] = account_id
    data = None
    if body is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=45) as response:
            raw = response.read().decode("utf-8", errors="replace")
            return {"statusCode": response.status, "ok": True, "body": json.loads(raw) if raw else {}}
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            parsed: Any = json.loads(raw)
        except json.JSONDecodeError:
            parsed = {"message": raw[:1000]}
        return {"statusCode": exc.code, "ok": False, "body": parsed}
    except Exception as exc:  # pragma: no cover - network-specific
        return {"statusCode": 0, "ok": False, "body": {"message": str(exc)}}


def bool_value(value: str | None) -> bool:
    return (value or "").strip().lower() in {"1", "true", "yes", "on"}


def main() -> int:
    parser = argparse.ArgumentParser(description="Run a read-only preflight for the pinned KLUB-CY Wix migration")
    parser.add_argument("--env", default=".env.klub-cy.local", help="Local, ignored environment file")
    parser.add_argument("--state-dir", default=".klub-wix-migration", help="Durable local migration-state directory")
    parser.add_argument("--repo-root", default=".", help="KLUB repository root")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    env_path = Path(args.env)
    if not env_path.is_absolute():
        env_path = repo_root / env_path
    state_dir = Path(args.state_dir)
    if not state_dir.is_absolute():
        state_dir = repo_root / state_dir
    state_dir.mkdir(parents=True, exist_ok=True)

    target = json.loads(TARGET_LOCK.read_text(encoding="utf-8"))
    env = load_env(env_path)
    api_key = load_api_key(env, repo_root)
    wix = target["wix"]
    source = target["source"]
    account_id = wix["accountId"]
    site_id = wix["siteId"]
    expected_name = wix["displayName"]

    pinned_env = {
        "WIX_ACCOUNT_ID": account_id,
        "WIX_SITE_ID": site_id,
        "WIX_SITE_NAME": expected_name,
    }
    mismatches = {
        key: {"expected": expected, "actual": env.get(key)}
        for key, expected in pinned_env.items()
        if env.get(key) != expected
    }
    if mismatches:
        raise RuntimeError(f"Target lock mismatch: {json.dumps(mismatches)}")

    checks: dict[str, Any] = {}

    checks["querySites"] = request_json(
        "POST",
        "https://www.wixapis.com/site-list/v2/sites/query",
        api_key,
        account_id=account_id,
        body={"query": {"filter": {"name": expected_name}, "cursorPaging": {"limit": 20}}},
    )
    sites = checks["querySites"].get("body", {}).get("sites", []) if checks["querySites"]["ok"] else []
    exact_sites = [site for site in sites if site.get("id") == site_id and (site.get("displayName") == expected_name or site.get("name") == expected_name)]
    checks["querySites"]["sanitized"] = {
        "exactMatchCount": len(exact_sites),
        "sites": [
            {key: site.get(key) for key in ["id", "name", "displayName", "published", "premium", "editorType", "domainConnected"] if key in site}
            for site in exact_sites
        ],
    }
    checks["querySites"].pop("body", None)

    checks["listCollections"] = request_json(
        "GET",
        "https://www.wixapis.com/data/v2/collections?paging.limit=100&paging.offset=0&consistentRead=true",
        api_key,
        site_id=site_id,
    )
    collections = checks["listCollections"].get("body", {}).get("collections", []) if checks["listCollections"]["ok"] else []
    native = [item for item in collections if item.get("collectionType") == "NATIVE"]
    app_owned = [item for item in collections if item.get("collectionType") == "WIX_APP"]
    checks["listCollections"]["sanitized"] = {
        "total": len(collections),
        "nativeCount": len(native),
        "appOwnedCount": len(app_owned),
        "nativeCollections": [{"id": item.get("id"), "displayName": item.get("displayName"), "revision": item.get("revision")} for item in native],
        "appOwnedCollectionIds": [item.get("id") for item in app_owned],
    }
    checks["listCollections"].pop("body", None)

    checks["listBackups"] = request_json(
        "GET",
        "https://www.wixapis.com/wix-data/v2/backups?paging.limit=100&paging.offset=0",
        api_key,
        site_id=site_id,
    )
    backups = checks["listBackups"].get("body", {}).get("backups", []) if checks["listBackups"]["ok"] else []
    checks["listBackups"]["sanitized"] = {
        "count": len(backups),
        "backups": [
            {key: backup.get(key) for key in ["id", "status", "type", "requestedDate", "finishedDate", "sizeInBytes"] if key in backup}
            for backup in backups
        ],
    }
    checks["listBackups"].pop("body", None)

    checks["queryOAuthApps"] = request_json(
        "POST",
        "https://www.wixapis.com/oauth-app/v1/oauth-apps/query",
        api_key,
        site_id=site_id,
        account_id=account_id,
        body={"query": {"paging": {"limit": 100, "offset": 0}, "sort": []}},
    )
    oauth_apps = checks["queryOAuthApps"].get("body", {}).get("oAuthApps", []) if checks["queryOAuthApps"]["ok"] else []
    checks["queryOAuthApps"]["sanitized"] = {
        "count": len(oauth_apps),
        "apps": [
            {key: app.get(key) for key in ["id", "name", "description", "applicationType", "allowedRedirectDomains", "allowedRedirectUris", "loginUrl", "logoutUrl", "technology"] if key in app}
            for app in oauth_apps
        ],
    }
    checks["queryOAuthApps"].pop("body", None)

    checks["queryForms"] = request_json(
        "POST",
        "https://www.wixapis.com/form-schema-service/v4/forms/query",
        api_key,
        site_id=site_id,
        body={
            "namespace": "wix.form_app.form",
            "query": {
                "filter": {"namespace": {"$eq": "wix.form_app.form"}},
                "cursorPaging": {"limit": 100},
            },
        },
    )
    forms = checks["queryForms"].get("body", {}).get("forms", []) if checks["queryForms"]["ok"] else []
    checks["queryForms"]["sanitized"] = {
        "count": len(forms),
        "forms": [
            {key: form.get(key) for key in ["id", "name", "namespace", "revision"] if key in form}
            for form in forms
        ],
    }
    checks["queryForms"].pop("body", None)

    checks["listDomains"] = request_json(
        "GET",
        "https://www.wixapis.com/domains/v1/connected-domains?paging.limit=100",
        api_key,
        account_id=account_id,
    )
    domains = checks["listDomains"].get("body", {}).get("connectedDomains", []) if checks["listDomains"]["ok"] else []
    checks["listDomains"]["sanitized"] = {
        "count": len(domains),
        "matching": [domain for domain in domains if domain.get("siteInfo", {}).get("siteId") == site_id],
    }
    if not checks["listDomains"]["ok"]:
        checks["listDomains"]["sanitized"]["error"] = checks["listDomains"].get("body")
    checks["listDomains"].pop("body", None)

    required_read_checks = ["querySites", "listCollections", "listBackups", "queryOAuthApps", "queryForms"]
    required_reads_ok = all(checks[name]["ok"] for name in required_read_checks) and len(exact_sites) == 1
    main_domain = (os.environ.get("WIX_MAIN_DOMAIN") or env.get("WIX_MAIN_DOMAIN") or "").strip()
    domain_ready = bool(main_domain) or bool(checks["listDomains"]["ok"] and checks["listDomains"]["sanitized"]["matching"])

    gates = {
        "requiredReadsPassed": required_reads_ok,
        "domainKnown": domain_ready,
        "wixWritesEnabled": bool_value(os.environ.get("KLUB_ALLOW_WIX_WRITES") or env.get("KLUB_ALLOW_WIX_WRITES")),
        "netlifyProductionDeployEnabled": bool_value(os.environ.get("KLUB_ALLOW_NETLIFY_PRODUCTION_DEPLOY") or env.get("KLUB_ALLOW_NETLIFY_PRODUCTION_DEPLOY")),
        "domainCutoverEnabled": bool_value(os.environ.get("KLUB_ALLOW_DOMAIN_CUTOVER") or env.get("KLUB_ALLOW_DOMAIN_CUTOVER")),
        "cmsRestoreEnabled": bool_value(os.environ.get("KLUB_ALLOW_CMS_RESTORE") or env.get("KLUB_ALLOW_CMS_RESTORE")),
        "targetSiteMatches": len(exact_sites) == 1,
    }
    blockers: list[str] = []
    if not required_reads_ok:
        blockers.append("One or more required read-only Wix API checks failed")
    if not domain_ready:
        blockers.append("Set WIX_MAIN_DOMAIN manually or add DOMAINS.READ_CONNECTED_DOMAINS to the API key")
    if len(exact_sites) != 1:
        blockers.append("The exact account/site/name triple did not resolve to one target")

    preflight = {
        "schemaVersion": "1.0",
        "mode": "READ_ONLY",
        "credentialPersisted": False,
        "target": target,
        "source": {
            "repository": source["repository"],
            "pinnedCommit": source["pinnedCommit"],
            "previewUrl": source["netlifyPreviewUrl"],
        },
        "checks": checks,
        "gates": gates,
        "blockers": blockers,
        "readyForEvaluation": required_reads_ok,
        "readyForWixWrites": required_reads_ok and domain_ready and gates["wixWritesEnabled"],
        "readyForDomainCutover": required_reads_ok and domain_ready and gates["domainCutoverEnabled"] and gates["netlifyProductionDeployEnabled"],
    }
    (state_dir / "preflight.json").write_text(json.dumps(preflight, indent=2) + "\n", encoding="utf-8")
    (state_dir / "destination.json").write_text(json.dumps(target["wix"], indent=2) + "\n", encoding="utf-8")
    (state_dir / "execution-gates.json").write_text(json.dumps(gates, indent=2) + "\n", encoding="utf-8")
    (state_dir / "intake.json").write_text(json.dumps({
        "sourceRepository": source["repository"],
        "pinnedCommit": source["pinnedCommit"],
        "previewUrl": source["netlifyPreviewUrl"],
        "architecture": target["architecture"],
        "deliveryMode": "integrated self-managed Headless frontend plus Wix CMS/CRM backend",
    }, indent=2) + "\n", encoding="utf-8")

    summary = {
        "mode": "READ_ONLY",
        "targetSiteMatches": gates["targetSiteMatches"],
        "requiredReadsPassed": required_reads_ok,
        "nativeCmsCollections": len(native),
        "appOwnedCmsCollections": len(app_owned),
        "cmsBackups": len(backups),
        "headlessOAuthApps": len(oauth_apps),
        "wixForms": len(forms),
        "domainKnown": domain_ready,
        "blockers": blockers,
        "stateFile": str(state_dir / "preflight.json"),
        "credentialExposed": False,
    }
    print(json.dumps(summary, indent=2))
    return 0 if required_reads_ok else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(json.dumps({"status": "ERROR", "message": str(exc), "credentialExposed": False}, indent=2), file=sys.stderr)
        raise SystemExit(1)
