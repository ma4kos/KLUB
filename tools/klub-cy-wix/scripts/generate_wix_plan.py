#!/usr/bin/env python3
"""Generate exact Wix CMS request bodies for KLUB without making network calls."""
from __future__ import annotations

import argparse
import hashlib
import json
import uuid
from pathlib import Path
from typing import Any

NAMESPACE = uuid.UUID("aef98eed-52ab-4a35-b80c-70850b91932b")
CREATE_COLLECTION_ENDPOINT = "https://www.wixapis.com/data/v2/collections"
BULK_SAVE_ENDPOINT = "https://www.wixapis.com/data/v2/bulk/items/save"
CREATE_COLLECTION_DOCS = "https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/create-data-collection"
BULK_SAVE_DOCS = "https://dev.wix.com/docs/api-reference/business-solutions/cms/data-items/bulk-save-data-items"

TEXT = "TEXT"
NUMBER = "NUMBER"
BOOLEAN = "BOOLEAN"
ARRAY_TEXT = {"type": "ARRAY", "typeMetadata": {"array": {"elementType": "TEXT"}}}

COLLECTIONS: dict[str, dict[str, Any]] = {
    "KlubClasses": {
        "source": "classes.json",
        "displayName": "KLUB Classes",
        "displayField": "name",
        "fields": {
            "sourceId": TEXT,
            "slug": TEXT,
            "name": TEXT,
            "shortDescription": TEXT,
            "intro": TEXT,
            "level": TEXT,
            "duration": TEXT,
            "capacity": TEXT,
            "priceDisplay": TEXT,
            "imageSourcePath": TEXT,
            "imageWixId": TEXT,
            "imageWixUrl": TEXT,
            "imageAlt": TEXT,
            "goodFor": ARRAY_TEXT,
            "whatToExpect": ARRAY_TEXT,
            "seoTitle": TEXT,
            "seoDescription": TEXT,
            "sortOrder": NUMBER,
            "sourceHash": TEXT,
        },
    },
    "KlubFaqSections": {
        "source": "faqSections.json",
        "displayName": "KLUB FAQ Sections",
        "displayField": "title",
        "fields": {"sourceId": TEXT, "title": TEXT, "sortOrder": NUMBER, "sourceHash": TEXT},
    },
    "KlubFaqItems": {
        "source": "faqItems.json",
        "displayName": "KLUB FAQ Items",
        "displayField": "question",
        "fields": {
            "sourceId": TEXT,
            "sectionSourceId": TEXT,
            "question": TEXT,
            "answer": TEXT,
            "sortOrder": NUMBER,
            "sourceHash": TEXT,
        },
    },
    "KlubPricingGroups": {
        "source": "pricingGroups.json",
        "displayName": "KLUB Pricing Groups",
        "displayField": "title",
        "fields": {
            "sourceId": TEXT,
            "title": TEXT,
            "blurb": TEXT,
            "columnLabels": ARRAY_TEXT,
            "sortOrder": NUMBER,
            "sourceHash": TEXT,
        },
    },
    "KlubPricingItems": {
        "source": "pricingItems.json",
        "displayName": "KLUB Pricing Items",
        "displayField": "name",
        "fields": {
            "sourceId": TEXT,
            "groupSourceId": TEXT,
            "name": TEXT,
            "priceDisplay": TEXT,
            "billingUnit": TEXT,
            "note": TEXT,
            "sortOrder": NUMBER,
            "sourceHash": TEXT,
        },
    },
    "KlubSiteSettings": {
        "source": "siteSettings.json",
        "displayName": "KLUB Site Settings",
        "displayField": "sourceId",
        "fields": {
            "sourceId": TEXT,
            "email": TEXT,
            "whatsappNumber": TEXT,
            "phoneDisplay": TEXT,
            "bookingUrl": TEXT,
            "bsportCompanyId": TEXT,
            "bsportWidgetId": TEXT,
            "ctaLabel": TEXT,
            "ctaCompact": TEXT,
            "ga4Id": TEXT,
            "clarityId": TEXT,
            "streetAddress": TEXT,
            "addressLocality": TEXT,
            "addressNote": TEXT,
            "instagram": TEXT,
            "instagramHandle": TEXT,
            "facebook": TEXT,
            "tiktok": TEXT,
            "tiktokHandle": TEXT,
            "openingLabel": TEXT,
            "openingHoursJson": TEXT,
            "foundingInterestOptions": ARRAY_TEXT,
            "foundingSubmitLabel": TEXT,
            "bannerEnabled": BOOLEAN,
            "bannerText": TEXT,
            "bannerLinkText": TEXT,
            "bannerLinkUrl": TEXT,
            "settingsJson": TEXT,
            "sourceHash": TEXT,
        },
    },
}

EXPECTED_COUNTS = {
    "KlubClasses": 4,
    "KlubFaqSections": 6,
    "KlubFaqItems": 38,
    "KlubPricingGroups": 4,
    "KlubPricingItems": 12,
    "KlubSiteSettings": 1,
}


def field_spec(key: str, value: Any) -> dict[str, Any]:
    spec: dict[str, Any] = {"key": key, "displayName": key}
    if isinstance(value, str):
        spec["type"] = value
    else:
        spec.update(value)
    return spec


def stable_id(source_id: str) -> str:
    return str(uuid.uuid5(NAMESPACE, source_id))


def normalize_record(collection_id: str, record: dict[str, Any]) -> dict[str, Any]:
    if collection_id != "KlubSiteSettings":
        normalized = dict(record)
        if collection_id == "KlubClasses":
            normalized.setdefault("imageWixId", "")
            normalized.setdefault("imageWixUrl", "")
        return normalized
    founding = record.get("foundingForm") or {}
    banner = record.get("banner") or {}
    return {
        "sourceId": record["sourceId"],
        "email": record.get("email", ""),
        "whatsappNumber": record.get("whatsappNumber", ""),
        "phoneDisplay": record.get("phoneDisplay", ""),
        "bookingUrl": record.get("bookingUrl", ""),
        "bsportCompanyId": str(record.get("bsportCompanyId", "")),
        "bsportWidgetId": str(record.get("bsportWidgetId", "")),
        "ctaLabel": record.get("ctaLabel", ""),
        "ctaCompact": record.get("ctaCompact", ""),
        "ga4Id": record.get("ga4Id", ""),
        "clarityId": record.get("clarityId", ""),
        "streetAddress": record.get("streetAddress", ""),
        "addressLocality": record.get("addressLocality", ""),
        "addressNote": record.get("addressNote", ""),
        "instagram": record.get("instagram", ""),
        "instagramHandle": record.get("instagramHandle", ""),
        "facebook": record.get("facebook", ""),
        "tiktok": record.get("tiktok", ""),
        "tiktokHandle": record.get("tiktokHandle", ""),
        "openingLabel": record.get("openingLabel", ""),
        "openingHoursJson": json.dumps(record.get("openingHours", []), separators=(",", ":")),
        "foundingInterestOptions": founding.get("interestOptions", []),
        "foundingSubmitLabel": founding.get("submitLabel", ""),
        "bannerEnabled": bool(banner.get("enabled", False)),
        "bannerText": banner.get("text", ""),
        "bannerLinkText": banner.get("linkText", ""),
        "bannerLinkUrl": banner.get("linkUrl", ""),
        "settingsJson": json.dumps({key: value for key, value in record.items() if key not in {"sourceHash"}}, separators=(",", ":")),
        "sourceHash": record["sourceHash"],
    }


def sha256_json(value: Any) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate exact Wix CMS request bodies for the pinned KLUB migration")
    parser.add_argument("--payload-dir", required=True, help="Directory produced by build-klub-payloads.mjs")
    parser.add_argument("--output-dir", required=True, help="Directory for the no-write Wix request plan")
    args = parser.parse_args()

    payload_dir = Path(args.payload_dir).resolve()
    output_dir = Path(args.output_dir).resolve()
    collection_dir = output_dir / "create-collection-requests"
    bulk_dir = output_dir / "bulk-save-requests"
    collection_dir.mkdir(parents=True, exist_ok=True)
    bulk_dir.mkdir(parents=True, exist_ok=True)

    mapping: dict[str, Any] = {"schemaVersion": "1.0", "collections": {}}
    operations: list[dict[str, Any]] = []

    for collection_id, config in COLLECTIONS.items():
        source_file = payload_dir / config["source"]
        records = json.loads(source_file.read_text(encoding="utf-8"))
        expected = EXPECTED_COUNTS[collection_id]
        if len(records) != expected:
            raise RuntimeError(f"{collection_id}: expected {expected} pinned records, found {len(records)}")

        create_body = {
            "collection": {
                "id": collection_id,
                "displayName": config["displayName"],
                "displayField": config["displayField"],
                "fields": [field_spec(key, value) for key, value in config["fields"].items()],
                "permissions": {"insert": "ADMIN", "update": "ADMIN", "remove": "ADMIN", "read": "ANYONE"},
            }
        }
        normalized_records = [normalize_record(collection_id, record) for record in records]
        data_items = [
            {"id": stable_id(record["sourceId"]), "data": record}
            for record in normalized_records
        ]
        bulk_body = {"dataCollectionId": collection_id, "dataItems": data_items, "returnEntity": True}

        create_path = collection_dir / f"{collection_id}.json"
        bulk_path = bulk_dir / f"{collection_id}.json"
        create_path.write_text(json.dumps(create_body, indent=2) + "\n", encoding="utf-8")
        bulk_path.write_text(json.dumps(bulk_body, indent=2) + "\n", encoding="utf-8")

        mapping["collections"][collection_id] = {
            "sourceFile": config["source"],
            "recordCount": len(records),
            "createRequest": str(create_path.relative_to(output_dir)),
            "bulkSaveRequest": str(bulk_path.relative_to(output_dir)),
            "createRequestSha256": sha256_json(create_body),
            "bulkSaveRequestSha256": sha256_json(bulk_body),
            "identity": "dataItem.id = UUIDv5(KLUB namespace, sourceId)",
        }
        operations.extend([
            {
                "order": len(operations) + 1,
                "mode": "IDEMPOTENT_SETUP",
                "method": "POST",
                "endpoint": CREATE_COLLECTION_ENDPOINT,
                "docsUrl": CREATE_COLLECTION_DOCS,
                "permission": "WIX_DATA.CREATE_COLLECTION",
                "bodyFile": str(create_path.relative_to(output_dir)),
                "rule": "Create only when collection ID is absent; never delete or replace an existing collection automatically.",
            },
            {
                "order": len(operations) + 1,
                "mode": "IDEMPOTENT_UPSERT",
                "method": "POST",
                "endpoint": BULK_SAVE_ENDPOINT,
                "docsUrl": BULK_SAVE_DOCS,
                "permission": "WIX_DATA.BULK_SAVE",
                "bodyFile": str(bulk_path.relative_to(output_dir)),
                "rule": "Use deterministic IDs and complete records; read back count, IDs, and sourceHash after the call.",
            },
        ])

    mapping["totalRecords"] = sum(item["recordCount"] for item in mapping["collections"].values())
    mapping["mappingSha256"] = sha256_json(mapping["collections"])
    (output_dir / "mapping.json").write_text(json.dumps(mapping, indent=2) + "\n", encoding="utf-8")

    execution_plan = {
        "schemaVersion": "1.0",
        "mode": "NO_WRITE_PLAN",
        "targetSiteId": "20f11f6f-6ce3-469d-b44c-df397c750848",
        "operations": operations,
        "prohibited": [
            "Delete or truncate any existing WIX_APP collection",
            "Restore a CMS backup automatically",
            "Write to any site other than the pinned KLUB-CY site",
            "Place the API key in frontend code or committed files",
        ],
        "approvalGate": "KLUB_ALLOW_WIX_WRITES=true plus exact target lock match",
    }
    execution_plan["planSha256"] = sha256_json(execution_plan)
    (output_dir / "execution-plan.json").write_text(json.dumps(execution_plan, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({
        "mode": "NO_WRITE_PLAN",
        "collectionCount": len(COLLECTIONS),
        "recordCount": mapping["totalRecords"],
        "mappingSha256": mapping["mappingSha256"],
        "outputDir": str(output_dir),
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
