# Post-Remediation Audit Report: Live Wix REST/MCP Contracts

## Overview
This audit examines the Live Wix REST/MCP contracts domain in the final KLUB-CY kit archive (`klub-cy-kit-final-audit.zip`). The audit specifically reviews CMS collections/items, paging, media upload, OAuth, backups, Forms, CRM contacts, exact endpoints, permissions, and read-back rules.

## Findings

### CMS Collections/Items & Paging
- **List Data Collections**: Verified against live schema (`GET https://www.wixapis.com/data/v2/collections`). The live schema supports offset paging (`paging.limit` and `paging.offset`), and `preflight.py` correctly uses these parameters.
- **Bulk Save Data Items**: Verified against live schema (`POST https://www.wixapis.com/data/v2/bulk/items/save`). The scripts correctly use this `publicUrl` instead of the older `/wix-data/` gateway segment.
- **Query Data Items**: Verified against live schema (`POST https://www.wixapis.com/data/v2/items/query`).

### Media Upload
- **Generate File Upload URL**: Verified against live schema (`POST https://www.wixapis.com/site-media/v1/files/generate-upload-url`). The workflow properly instructs generating an upload URL for each local source asset and uploading the binary with a `PUT` request to the signed URL.

### Backups
- **Restore Backup**: Correctly identified as a destructive action. The contract documentation links to the official Wix API reference.

### OAuth
- **Headless OAuth**: Properly documented in `Verified_Live_Wix_API_Contracts.md` and `ONE_SHOT_PROMPT.md`. The workflow correctly specifies using the public Headless client with `OAuthStrategy` for public-read native collections and avoiding the administrator API key in browser-delivered code.

### Forms
- **Query Forms**: Verified against live schema (`POST https://www.wixapis.com/form-schema-service/v4/forms/query`). `preflight.py` correctly uses this endpoint with the namespace equality condition (`wix.form_app.form`).

### CRM Contacts
- **Create Contact V4**: Verified against live schema (`POST https://www.wixapis.com/contacts/v4/contacts`). The live schema includes the `allowDuplicates` parameter, and the package correctly defaults to `false` and requires read-before-create/reconciliation.

### Exact Endpoints, Permissions, and Read-Back Rules
- **Endpoints & Permissions**: The endpoints and required permissions (e.g., `WIX_DATA.LIST_COLLECTIONS`, `WIX_DATA.CREATE_COLLECTION`, `WIX_DATA.BULK_SAVE`, `WIX_DATA.QUERY`, `MEDIA.SITE_MEDIA_FILES_UPLOAD`, `CONTACTS.MODIFY`) are accurately documented and used in the validation scripts.
- **Read-Back Rules**: The `ONE_SHOT_PROMPT.md` and workflow documents explicitly require read-back reconciliation (e.g., "Confirm Wix read-back: six native collections, 65 records, exact hashes/counts, expected forms, expected OAuth app, no unintended business-data change").

## Blockers and Warnings
No release blockers were found. The previously reported blockers in the `VALIDATION_REPORT.md` (such as the planner using a wrong URL or REST Create Contact lacking `allowDuplicates`) were disproved against the actual files in the remediated package.

- **Blocker Count**: 0
- **Warning Count**: 0

## Verdict
**PASS**
