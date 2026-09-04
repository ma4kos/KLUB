# Verified Live Wix API Contracts for KLUB-CY

**Verified:** 2026-09-03 using the official Wix MCP documentation search, live API schemas, and read-only requests with the supplied API key.

## Pinned destination

| Property | Verified value |
|---|---|
| Account ID | `8372deba-8664-4ad5-8212-6c10a7f348b1` |
| Site display name | `KLUB-CY` |
| Site ID | `20f11f6f-6ce3-469d-b44c-df397c750848` |
| State | Draft, Premium, custom domain connected |
| Editor | Classic Editor / `EDITOR` |
| Velo | Enabled |
| Headless OAuth apps | 0 |
| Native CMS collections | 0 |
| App-owned CMS collections | 15 |
| Wix Forms schemas | 0 |
| CMS backups | 0 |

The API key returned HTTP 200 for Query Sites, Dynamic Site Context, List Data Collections, Query OAuth Apps, Query Forms, and List Backups. It returned HTTP 403 `DOMAINS_PERMISSION_DENIED` for `DOMAINS.READ_CONNECTED_DOMAINS`; the exact attached domain therefore must be identified manually or by adding that permission to the API key.

## Live-verified endpoint matrix

| Purpose | Method | Public endpoint | Permission | Status |
|---|---|---|---|---|
| Query account sites | POST | `https://www.wixapis.com/site-list/v2/sites/query` | `SITE_LIST.READ` | Read-only call passed, one exact site |
| Dynamic Site Context | POST | `https://www.wixapis.com/_api/dynamic-context/v1/dynamic-context` | `code:context:v1:get_dynamic_context` | Read-only call passed |
| List connected domains | GET | `https://www.wixapis.com/domains/v1/connected-domains` | `DOMAINS.READ_CONNECTED_DOMAINS` | Schema verified; live call denied by key |
| Duplicate site | POST | `https://www.wixapis.com/site-actions/v1/sites/duplicate` | `my-account.duplicate-site` | Schema/docs verified; not executed |
| List CMS collections | GET | `https://www.wixapis.com/data/v2/collections` | `WIX_DATA.LIST_COLLECTIONS` | Read-only call passed; 15 app collections, 0 native |
| Create CMS collection | POST | `https://www.wixapis.com/data/v2/collections` | `WIX_DATA.CREATE_COLLECTION` | Live schema verified; not executed |
| Bulk save CMS items | POST | `https://www.wixapis.com/data/v2/bulk/items/save` | `WIX_DATA.BULK_SAVE` | Live schema verified; not executed |
| Query CMS items for reconciliation | POST | `https://www.wixapis.com/data/v2/items/query` | `WIX_DATA.QUERY` | Live schema verified; not executed |
| Generate Media upload URL | POST | `https://www.wixapis.com/site-media/v1/files/generate-upload-url` | `MEDIA.SITE_MEDIA_FILES_UPLOAD` | Live schema verified; not executed |
| Import Media Manager file | POST | `https://www.wixapis.com/site-media/v1/files/import` | `MEDIA.SITE_MEDIA_FILES_IMPORT` | Live schema verified; not executed |
| Get Media file descriptor | GET | `https://www.wixapis.com/site-media/v1/files/get-file-by-id` | `MEDIA.SITE_MEDIA_FILES_READ` | Live schema verified |
| Create CMS backup | POST | `https://www.wixapis.com/wix-data/v2/backups` | `WIX_DATA.CREATE_BACKUP` | Live schema verified; not executed |
| List CMS backups | GET | `https://www.wixapis.com/wix-data/v2/backups` | `WIX_DATA.LIST_BACKUPS` | Read-only call passed; 0 backups |
| Restore CMS backup | POST | `https://www.wixapis.com/wix-data/v2/backups/{backupId}/restore` | `WIX_DATA.RESTORE_BACKUP` | Live schema verified; destructive, not executed |
| Query Headless OAuth apps | POST | `https://www.wixapis.com/oauth-app/v1/oauth-apps/query` | `OAUTH_APP.APP_READ` | Read-only call passed; 0 apps |
| Create Headless OAuth app | POST | `https://www.wixapis.com/oauth-app/v1/oauth-apps` | `OAUTH_APP.APP_CREATE` | Live schema verified; not executed |
| Get Headless OAuth app | GET | `https://www.wixapis.com/oauth-app/v1/oauth-apps/{oAuthAppId}` | `OAUTH_APP.APP_READ` | Live schema verified |
| Update Headless OAuth app | PATCH | `https://www.wixapis.com/oauth-app/v1/oauth-apps/{oAuthApp.id}` | `OAUTH_APP.APP_UPDATE` | Live schema verified; requires masked update |
| Query Wix Forms | POST | `https://www.wixapis.com/form-schema-service/v4/forms/query` | `forms:v4:form:query_forms` | Read-only call passed; 0 forms |
| Create Wix Form | POST | `https://www.wixapis.com/form-schema-service/v4/forms` | `forms:v4:form:create_form` | Live schema verified; not executed |
| Create Form submission | POST | `https://www.wixapis.com/forms/v4/submissions` | `forms:v4:submission:create_submission` | Live schema verified; not executed |
| Create CRM contact V4 | POST | `https://www.wixapis.com/contacts/v4/contacts` | `CONTACTS.MODIFY` | Live schema verified; not executed |

## Important contract notes

The live REST schema’s `publicUrl` is authoritative when it differs from prose/code examples. The current schemas returned `https://www.wixapis.com/data/v2/collections` and `https://www.wixapis.com/data/v2/bulk/items/save`, while some documentation examples still show the older `/wix-data/` gateway segment. The migration package must use the live schema URL or rediscover it at runtime through the Wix MCP.

Bulk Save Data Items inserts when no matching ID exists and updates when a provided ID exists. Updating with Bulk Save completely replaces the existing item at that ID, so migration code must construct complete records and use deterministic source-derived IDs. Create Data Collection requires an ID, at least one field, and a permissions object.

Import File is asynchronous: the returned file is not immediately ready for use. The package must persist the source-to-Wix file ID crosswalk and poll Get File Descriptor or use the relevant readiness event before replacing source URLs.

Duplicate Site does not copy store orders, contacts, invoices, or third-party app settings; the duplicate receives no custom domain or Premium capabilities. It is therefore a design/configuration safeguard, not a complete business-data backup.

CMS backups cover live collection data and are asynchronous. Wix documents up to three on-demand backups per site; creating a fourth deletes the oldest on-demand backup. Restore Backup is destructive and must never be called during evaluation or staging.

Query Forms requires a namespace equality condition; the native Wix Forms namespace used for inventory is `wix.form_app.form`. Create Submission works only when the Wix Forms app is installed; KLUB-CY has Wix Forms & Payments installed but currently has zero form schemas.

The Create Contact method defaults to refusing a new contact when the submitted email is already in use unless `allowDuplicates` is explicitly true. The package should keep `allowDuplicates` false and query/read before creation when using Contacts directly.

## Self-managed SDK contract

For the existing-site migration path, install `@wix/sdk` and domain packages. Use `createClient` with `OAuthStrategy({ clientId, tokens?, siteId? })`. Visitor/member OAuth needs the public Headless client ID and no client secret. Persist visitor/member tokens with `generateVisitorTokens()`, `getTokens()`, and `setTokens()`. The admin API key remains server-only and is never included in browser bundles.

## Primary sources

- https://dev.wix.com/docs/api-reference/account-level/sites/sites/query-sites
- https://dev.wix.com/docs/api-reference/tools/dynamic-site-context/get-dynamic-context
- https://dev.wix.com/docs/api-reference/account-level/domains/connected-domains/connected-domain-v1/list-connected-domains
- https://dev.wix.com/docs/api-reference/account-level/sites/site-actions/duplicate-site
- https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/list-data-collections
- https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/create-data-collection
- https://dev.wix.com/docs/api-reference/business-solutions/cms/data-items/bulk-save-data-items
- https://dev.wix.com/docs/api-reference/assets/media/media-manager/files/import-file
- https://dev.wix.com/docs/api-reference/assets/media/media-manager/files/get-file-descriptor
- https://dev.wix.com/docs/api-reference/business-solutions/cms/operations/backups/create-backup
- https://dev.wix.com/docs/api-reference/business-solutions/cms/operations/backups/list-backups
- https://dev.wix.com/docs/api-reference/business-solutions/cms/operations/backups/restore-backup
- https://dev.wix.com/docs/api-reference/business-management/headless/oauth-apps/query-oauth-apps
- https://dev.wix.com/docs/api-reference/business-management/headless/oauth-apps/create-oauth-app
- https://dev.wix.com/docs/api-reference/business-management/headless/oauth-apps/get-oauth-app
- https://dev.wix.com/docs/api-reference/business-management/headless/oauth-apps/update-oauth-app
- https://dev.wix.com/docs/api-reference/crm/forms/form-schemas/query-forms
- https://dev.wix.com/docs/api-reference/crm/forms/form-schemas/create-form
- https://dev.wix.com/docs/api-reference/crm/forms/form-submissions/create-submission
- https://dev.wix.com/docs/api-reference/crm/members-contacts/contacts/contacts/contact-v4/create-contact
- https://dev.wix.com/docs/go-headless/authentication/setup/create-an-sdk-client-with-oauth
- https://dev.wix.com/docs/sdk/core-modules/sdk/oauth-strategy

## Additional verified contracts

| Purpose | Method | Public endpoint | Permission | Notes |
|---|---|---|---|---|
| Query native CMS data items | POST | `https://www.wixapis.com/data/v2/items/query` | `WIX_DATA.QUERY` | The current live method schema reports this `publicUrl`; request requires `dataCollectionId` and a query and supports offset paging with `returnTotalCount`. Some generated examples retain the older `/wix-data/` prefix, so runtime code must prefer the live `publicUrl`. |
| Generate local file upload URL | POST | `https://www.wixapis.com/site-media/v1/files/generate-upload-url` | `MEDIA.SITE_MEDIA_FILES_UPLOAD` | Body requires `mimeType`; recommended metadata includes `fileName`, with optional `filePath`, `parentFolderId`, privacy, and labels. |
| Upload binary to generated URL | PUT | The signed URL returned by Generate File Upload URL | Signed URL | Set the exact MIME type and upload the binary stream. A successful PUT may precede readiness; verify the returned `operationStatus` or poll Get File Descriptor/listen for File Ready. |

The protected Netlify deployment cannot be relied on as an anonymous source for server-side `Import File` calls. The safe media route is to generate a signed upload URL for each local repository asset and `PUT` the binary bytes, preserving a hash-based source-to-Wix crosswalk. For files larger than 10 MB or unreliable connections, Wix recommends the resumable upload workflow.

Additional sources:
- https://dev.wix.com/docs/api-reference/business-solutions/cms/data-items/query-data-items
- https://dev.wix.com/docs/api-reference/assets/media/media-manager/files/generate-file-upload-url
- https://dev.wix.com/docs/api-reference/assets/media/media-manager/files/upload-api
